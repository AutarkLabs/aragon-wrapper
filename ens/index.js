"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = _resolve;
exports.default = _default;

var _ethjsEns = _interopRequireDefault(require("ethjs-ens"));

const debug = require('debug')('aragon.ens');
/**
 * Resolve an ens name or node
 *
 * @param {string} nameOrNode
 * @param {*} opts
 * @returns {Promise<string>}
 */


function _resolve(nameOrNode, opts = {
  provider: {}
}) {
  const isName = nameOrNode.includes('.'); // Stupid hack for ethjs-ens

  if (!opts.provider.sendAsync) {
    opts.provider.sendAsync = opts.provider.send;
  }

  const ens = new _ethjsEns.default(opts);

  if (isName) {
    debug("Looking up ENS name ".concat(nameOrNode));
    return ens.lookup(nameOrNode);
  }

  debug("Looking up ENS node ".concat(nameOrNode));
  return ens.resolveAddressForNode(nameOrNode);
}

function _default(provider, registryAddress) {
  return {
    resolve: name => _resolve(name, {
      provider,
      registryAddress
    })
  };
}
//# sourceMappingURL=index.js.map