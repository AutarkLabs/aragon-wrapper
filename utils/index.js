"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressesEqual = addressesEqual;
exports.includesAddress = includesAddress;
exports.makeAddressMapProxy = makeAddressMapProxy;
exports.getCacheKey = getCacheKey;
exports.makeProxy = makeProxy;
exports.makeProxyFromAppABI = makeProxyFromAppABI;
exports.makeProxyFromABI = makeProxyFromABI;
Object.defineProperty(exports, "AsyncRequestCache", {
  enumerable: true,
  get: function get() {
    return _AsyncRequestCache.default;
  }
});
exports.ANY_ENTITY = void 0;

var _web3Utils = require("web3-utils");

var _proxy = _interopRequireDefault(require("../core/proxy"));

var _interfaces = require("../interfaces");

var _AsyncRequestCache = _interopRequireDefault(require("./AsyncRequestCache"));

const ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'; // Check address equality without checksums

exports.ANY_ENTITY = ANY_ENTITY;

function addressesEqual(first, second) {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
} // "Safer" version of [].includes() for addresses


function includesAddress(arr, address) {
  return arr.some(a => addressesEqual(a, address));
} // Address map that ensures consistent non-checksummed interpretations of addresses


function makeAddressMapProxy(target = {}) {
  const targetLowerCaseKeys = {};
  Object.entries(target).forEach(([address, val]) => {
    targetLowerCaseKeys[address.toLowerCase()] = val;
  });
  return new Proxy(targetLowerCaseKeys, {
    get(target, property, receiver) {
      if (property in target) {
        return target[property];
      }

      if (typeof property === 'string' && (0, _web3Utils.isAddress)(property)) {
        // Our set handler will ensure any addresses are stored in all lowercase
        return target[property.toLowerCase()];
      }
    },

    set(target, property, value, receiver) {
      if (typeof property === 'string' && (0, _web3Utils.isAddress)(property)) {
        target[property.toLowerCase()] = value;
      } else {
        target[property] = value;
      }

      return true;
    }

  });
}
/**
 * Get a standard cache key
 *
 * @param {string} address
 * @param {string} location
 */


function getCacheKey(address, location) {
  return "".concat(address, ".").concat(location);
}

function makeProxy(address, interfaceName, web3, options) {
  const abi = (0, _interfaces.getAbi)("aragon/".concat(interfaceName));
  return makeProxyFromABI(address, abi, web3, options);
}

const appProxyEventsAbi = (0, _interfaces.getAbi)('aragon/AppProxy').filter(({
  type
}) => type === 'event');

function makeProxyFromAppABI(address, appAbi, web3, options) {
  const appAbiWithProxyEvents = [].concat(appAbi, appProxyEventsAbi);
  return makeProxyFromABI(address, appAbiWithProxyEvents, web3, options);
}

function makeProxyFromABI(address, abi, web3, options) {
  return new _proxy.default(address, abi, web3, options);
}
//# sourceMappingURL=index.js.map