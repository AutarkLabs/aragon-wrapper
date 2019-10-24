"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(request, proxy, wrapper) {
  const [searchTerm] = request.params;

  if (searchTerm.length < 3) {
    // Empty response for requests with less than 3 chars
    return Promise.resolve([]);
  }

  return wrapper.searchIdentities(searchTerm);
}
//# sourceMappingURL=search-identities.js.map