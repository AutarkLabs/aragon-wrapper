"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  const [actionId, blockNumber, evmScript, status] = request.params;
  wrapper.setForwardedAction({
    actionId,
    blockNumber,
    currentApp: proxy.address,
    evmScript,
    status
  });
  return Promise.resolve();
}
//# sourceMappingURL=update-forwarded-action.js.map