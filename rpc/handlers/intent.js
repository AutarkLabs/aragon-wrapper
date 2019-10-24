"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

async function _default(request, proxy, wrapper) {
  const transactionPath = await wrapper.getTransactionPath(proxy.address, request.params[0], // contract method
  request.params.slice(1) // params
  );
  return wrapper.performTransactionPath(transactionPath);
}
//# sourceMappingURL=intent.js.map