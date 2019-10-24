"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  const [operation, address] = request.params;

  if (operation === 'resolve') {
    return wrapper.resolveAddressIdentity(address);
  }

  if (operation === 'modify') {
    return wrapper.requestAddressIdentityModification(address);
  }

  return Promise.reject(new Error('Invalid address identity operation'));
}
//# sourceMappingURL=address-identity.js.map