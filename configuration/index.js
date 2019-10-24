"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfiguration = getConfiguration;
exports.setConfiguration = setConfiguration;
// Simple key-value configuration store
const CONFIGURATION = {};

function getConfiguration(key) {
  return key ? CONFIGURATION[key] : CONFIGURATION;
}

function setConfiguration(key, value) {
  CONFIGURATION[key] = value;
}
//# sourceMappingURL=index.js.map