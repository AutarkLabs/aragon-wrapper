"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeKernelSetAppParameters = decodeKernelSetAppParameters;
exports.getKernelNamespace = getKernelNamespace;
exports.isKernelAppCodeNamespace = isKernelAppCodeNamespace;
exports.isKernelSetAppIntent = isKernelSetAppIntent;

var _web3EthAbi = _interopRequireDefault(require("web3-eth-abi"));

var _web3Utils = require("web3-utils");

var _utils = require("../../utils");

var _apps = require("../../utils/apps");

const SET_APP_ABI = [{
  name: 'namespace',
  type: 'bytes32'
}, {
  name: 'appId',
  type: 'bytes32'
}, {
  name: 'appAddress',
  type: 'address'
}];
const CORE_NAMESPACE = (0, _web3Utils.soliditySha3)('core');
const APP_ADDR_NAMESPACE = (0, _web3Utils.soliditySha3)('app');
const APP_BASES_NAMESPACE = (0, _web3Utils.soliditySha3)('base');
const KERNEL_NAMESPACES_NAMES = new Map([[CORE_NAMESPACE, 'Core'], [APP_ADDR_NAMESPACE, 'Default apps'], [APP_BASES_NAMESPACE, 'App code']]);
/**
 * Decode `Kernel.setApp()` parameters based on transaction data.
 *
 * @param  {Object} data Transaction data
 * @return {Object} Decoded parameters for `setApp()` (namespace, appId, appAddress)
 */

function decodeKernelSetAppParameters(data) {
  // Strip 0x prefix + bytes4 sig to get parameter data
  const paramData = data.substring(10);
  return _web3EthAbi.default.decodeParameters(SET_APP_ABI, paramData);
}

function getKernelNamespace(hash) {
  return KERNEL_NAMESPACES_NAMES.has(hash) ? {
    name: KERNEL_NAMESPACES_NAMES.get(hash),
    hash
  } : null;
}

function isKernelAppCodeNamespace(namespaceHash) {
  return namespaceHash === APP_BASES_NAMESPACE;
}
/**
 * Is the transaction intent for `Kernel.setApp()`?
 *
 * @param  {Object} kernelApp App artifact for Kernel
 * @param  {Object} intent Transaction intent
 * @return {Boolean} Whether the intent is `Kernel.setApp()`
 */


function isKernelSetAppIntent(kernelApp, intent) {
  if (!(0, _utils.addressesEqual)(kernelApp.proxyAddress, intent.to)) return false;
  const method = (0, _apps.findAppMethodFromData)(kernelApp, intent.data);
  return !!method && method.sig === 'setApp(bytes32,bytes32,address)';
}
//# sourceMappingURL=kernel.js.map