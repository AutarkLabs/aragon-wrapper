"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

function ensureContext(apps, appAddress, context) {
  let app = apps.get(appAddress);

  if (!app) {
    app = new Map();
    apps.set(appAddress, app);
  }

  let appContext = app.get(context);

  if (!appContext) {
    appContext = new _rxjs.BehaviorSubject(null);
    app.set(context, appContext);
  }

  return appContext;
}

class AppContextPool {
  constructor() {
    _apps.set(this, {
      writable: true,
      value: new Map()
    });
  }

  hasApp(appAddress) {
    return (0, _classPrivateFieldGet2.default)(this, _apps).has(appAddress);
  }

  async get(appAddress, context) {
    const app = (0, _classPrivateFieldGet2.default)(this, _apps).get(appAddress);

    if (!app || !app.has(context)) {
      return null;
    }

    return app.get(context).pipe((0, _operators.first)()).toPromise();
  }

  observe(appAddress, context) {
    const appContext = ensureContext((0, _classPrivateFieldGet2.default)(this, _apps), appAddress, context);
    return appContext;
  }

  set(appAddress, context, value) {
    const appContext = ensureContext((0, _classPrivateFieldGet2.default)(this, _apps), appAddress, context);
    appContext.next(value);
  }

}

exports.default = AppContextPool;

var _apps = new WeakMap();
//# sourceMappingURL=index.js.map