"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _utils = require("../../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function transformAppInformation(app = {}, getContentPathFn) {
  const {
    appId,
    content,
    contractAddress,
    icons,
    identifier,
    isForwarder,
    kernelAddress,
    name,
    proxyAddress
  } = app;
  let iconsWithBaseUrl;

  try {
    iconsWithBaseUrl = icons.map(icon => _objectSpread({}, icon, {
      src: getContentPathFn(content, icon.src)
    }));
  } catch (_) {}

  return {
    icons: iconsWithBaseUrl,
    identifier,
    kernelAddress,
    name,
    appAddress: proxyAddress,
    appId: appId,
    appImplementationAddress: contractAddress,
    isForwarder: Boolean(isForwarder)
  };
}

function _default(request, proxy, wrapper) {
  const operation = request.params[0];
  let appCategory = request.params[1];

  if (appCategory !== 'all' && appCategory !== 'current') {
    appCategory = 'all';
  } // Backwards compatibility with initial RPC API (no parameters passed)


  if (operation === undefined) {
    return wrapper.apps;
  }

  const appWithIdentifier$ = (0, _rxjs.combineLatest)(wrapper.apps, wrapper.appIdentifiers).pipe((0, _operators.map)(([apps, identifiers]) => apps.map(app => _objectSpread({}, app, {
    identifier: identifiers[app.proxyAddress]
  }))));
  const getContentPathFn = wrapper.apm.getContentPath;
  const app$ = appCategory === 'current' ? appWithIdentifier$.pipe((0, _operators.map)(apps => apps.find(app => (0, _utils.addressesEqual)(app.proxyAddress, proxy.address))), (0, _operators.map)(app => transformAppInformation(app, getContentPathFn))) : appWithIdentifier$.pipe((0, _operators.map)(apps => apps.map(app => transformAppInformation(app, getContentPathFn))));

  if (operation === 'observe') {
    return app$;
  }

  if (operation === 'get') {
    return app$.pipe((0, _operators.first)());
  }

  return Promise.reject(new Error('Invalid get apps operation'));
}
//# sourceMappingURL=get-apps.js.map