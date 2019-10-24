"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

async function _default(request, proxy, wrapper) {
  const script = request.params[0];
  const describedPath = await wrapper.describeTransactionPath(wrapper.decodeTransactionPath(script)); // Add name and identifier decoration
  // TODO: deprecate this now that the app has enough information to get this information itself
  // through getApps()

  const identifiers = await wrapper.appIdentifiers.pipe((0, _operators.first)()).toPromise();
  return Promise.all(describedPath.map(async step => {
    const app = await wrapper.getApp(step.to);

    if (app) {
      return _objectSpread({}, step, {
        identifier: identifiers[step.to],
        name: app.name
      });
    }

    return step;
  }));
}
//# sourceMappingURL=describe-script.js.map