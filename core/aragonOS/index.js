"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAragonOsInternalAppInfo = getAragonOsInternalAppInfo;
exports.isAragonOsInternalApp = isAragonOsInternalApp;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interfaces = require("../../interfaces");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function getAragonOsInternalAppInfo(appId) {
  const appInfo = (0, _interfaces.getAppInfo)(appId, 'aragon');
  return appInfo && _objectSpread({}, appInfo, {
    isAragonOsInternalApp: true
  });
}

function isAragonOsInternalApp(appId) {
  return (0, _interfaces.hasAppInfo)(appId, 'aragon');
}
//# sourceMappingURL=index.js.map