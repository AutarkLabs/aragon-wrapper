"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  wrapper.setAppIdentifier(proxy.address, request.params[0]);
  return Promise.resolve();
}
//# sourceMappingURL=app-identifier.js.map