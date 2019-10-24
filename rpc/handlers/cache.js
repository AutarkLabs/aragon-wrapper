"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("../../utils/index");

function _default(request, proxy, wrapper) {
  const cacheKey = (0, _index.getCacheKey)(proxy.address, request.params[1]);

  if (request.params[0] === 'set') {
    return wrapper.cache.set(cacheKey, request.params[2]);
  }

  if (request.params[0] === 'get') {
    return wrapper.cache.get(cacheKey);
  }

  if (request.params[0] === 'observe') {
    return wrapper.cache.observe(cacheKey);
  }

  return Promise.reject(new Error('Invalid cache operation'));
}
//# sourceMappingURL=cache.js.map