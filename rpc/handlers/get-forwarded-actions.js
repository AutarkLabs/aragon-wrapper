"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _operators = require("rxjs/operators");

function _default(request, proxy, wrapper) {
  return wrapper.forwardedActions.pipe( // transform the observable into an event-like object
  // that only contains actions targeting the proxy
  (0, _operators.map)(actions => ({
    event: 'ForwardedActions',
    returnValues: actions[proxy.address]
  })), // only emit observables that
  // contain actions
  (0, _operators.filter)(proxyActionEvents => proxyActionEvents.returnValues));
}
//# sourceMappingURL=get-forwarded-actions.js.map