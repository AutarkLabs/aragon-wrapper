"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  const message = request.params[0];
  return wrapper.signMessage(message, proxy.address);
}
//# sourceMappingURL=sign-message.js.map