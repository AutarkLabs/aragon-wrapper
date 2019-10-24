"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _events = require("../../utils/events");

function _default(request, proxy, wrapper) {
  // `past_events` RPC compatibility with aragonAPI versions:
  //   - aragonAPIv2: `'past_events', [eventNames, eventOptions]`
  //   - aragonAPIv1: `'past_events', [fromBlock (optional), toBlock (optional)]`
  if (request.params.length === 2 && typeof request.params[1] === 'object') {
    // aragonAPIv2
    const eventNames = (0, _events.getEventNames)(request.params[0]);
    const eventOptions = request.params[1];
    return proxy.pastEvents(eventNames, eventOptions);
  } else if (request.params.length <= 2) {
    // aragonAPIv1
    const fromBlock = request.params[0];
    const toBlock = request.params[1];
    return proxy.pastEvents(null, {
      fromBlock,
      toBlock
    });
  } // Otherwise, just use pastEvent defaults


  return proxy.pastEvents();
}
//# sourceMappingURL=past-events.js.map