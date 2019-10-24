"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.call = call;
exports.intent = intent;
exports.events = events;
exports.pastEvents = pastEvents;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _configuration = require("../../configuration");

var configurationKeys = _interopRequireWildcard(require("../../configuration/keys"));

var _events = require("../../utils/events");

function call(request, proxy, wrapper) {
  const web3 = wrapper.web3;
  const [address, methodJsonDescription, ...params] = request.params;
  const contract = new web3.eth.Contract([methodJsonDescription], address);
  return contract.methods[methodJsonDescription.name](...params).call();
}

async function intent(request, proxy, wrapper) {
  const [address, methodJsonDescription, ...params] = request.params;
  const transactionPath = await wrapper.getExternalTransactionPath(address, methodJsonDescription, params);
  return wrapper.performTransactionPath(transactionPath, {
    external: true
  });
}

function events(request, proxy, wrapper) {
  const web3 = wrapper.web3;
  const [address, jsonInterface] = request.params;
  const contract = new web3.eth.Contract(jsonInterface, address); // `external_events` RPC compatibility with aragonAPI versions:
  //   - aragonAPIv2: `'external_events', [address, jsonInterface, eventNames, eventOptions]`
  //   - aragonAPIv1: `'external_events', [address, jsonInterface, fromBlock (optional)]`

  let eventNames;
  let eventOptions;

  if (request.params.length === 4) {
    // aragonAPIv2
    eventNames = (0, _events.getEventNames)(request.params[2]);
    eventOptions = request.params[3];
  } else if (request.params.length <= 3) {
    // aragonAPIv1
    eventNames = ['allEvents'];
    eventOptions = {
      fromBlock: request.params[2]
    };
  } // Use the app proxy's initialization block by default


  if (eventOptions.fromBlock == null) {
    eventOptions.fromBlock = proxy.initializationBlock;
  }

  let eventSource;

  if (eventNames.length === 1) {
    // Get a specific event or all events unfiltered
    eventSource = (0, _rxjs.fromEvent)(contract.events[eventNames[0]](eventOptions), 'data');
  } else {
    // Get all events and filter ourselves
    eventSource = (0, _rxjs.fromEvent)(this.contract.events.allEvents(eventOptions), 'data').pipe((0, _operators.filter)(event => eventNames.includes(event.event)));
  }

  const eventDelay = (0, _configuration.getConfiguration)(configurationKeys.SUBSCRIPTION_EVENT_DELAY) || 0; // Small optimization: don't pipe a delay if we don't have to

  return eventDelay ? eventSource.pipe((0, _operators.delay)(eventDelay)) : eventSource;
}

function pastEvents(request, proxy, wrapper) {
  const web3 = wrapper.web3;
  const [address, jsonInterface] = request.params;
  const contract = new web3.eth.Contract(jsonInterface, address); // `external_past_events` RPC compatibility with aragonAPI versions:
  //   - aragonAPIv2: `'external_past_events', [address, jsonInterface, eventNames, eventOptions]`
  //   - aragonAPIv1: `'external_past_events', [address, jsonInterface, eventOptions]`

  let eventNames;
  let eventOptions;

  if (request.params.length === 4) {
    // aragonAPIv2
    eventNames = (0, _events.getEventNames)(request.params[2]);
    eventOptions = request.params[3];
  } else if (request.params.length === 3) {
    // aragonAPIv1
    eventNames = ['allEvents'];
    eventOptions = request.params[2];
  } // Use the app proxy's initialization block by default


  if (eventOptions.fromBlock == null) {
    eventOptions.fromBlock = proxy.initializationBlock;
  } // The `from`s only unpack the returned Promises (and not the array inside them!)


  if (eventNames.length === 1) {
    // Get a specific event or all events unfiltered
    return (0, _rxjs.from)(contract.getPastEvents(eventNames[0], eventOptions));
  } else {
    // Get all events and filter ourselves
    return (0, _rxjs.from)(contract.getPastEvents('allEvents', eventOptions).then(events => events.filter(event => eventNames.includes(event.event))));
  }
}
//# sourceMappingURL=external.js.map