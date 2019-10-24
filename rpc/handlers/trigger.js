"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trigger = trigger;
exports.triggerSubscribe = triggerSubscribe;

var _operators = require("rxjs/operators");

function trigger(request, proxy, wrapper) {
  const [eventName, returnValues] = request.params;
  wrapper.triggerAppStore(proxy.address, eventName, returnValues);
  return Promise.resolve();
}

function triggerSubscribe(request, proxy, wrapper) {
  return wrapper.trigger.pipe((0, _operators.filter)(appEvent => appEvent.origin === proxy.address), (0, _operators.map)(appEvent => appEvent.frontendEvent));
}
//# sourceMappingURL=trigger.js.map