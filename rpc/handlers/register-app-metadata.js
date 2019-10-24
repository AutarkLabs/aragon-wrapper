"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  const [blockNumber, dataId, cid, to] = request.params;
  wrapper.registerAppMetadata(proxy.address, blockNumber, dataId, cid, to);
  return Promise.resolve();
}
//# sourceMappingURL=register-app-metadata.js.map