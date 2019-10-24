"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryEvaluatingRadspec = tryEvaluatingRadspec;
exports.tryDescribingUpdateAppIntent = tryDescribingUpdateAppIntent;
exports.tryDescribingUpgradeOrganizationBasket = tryDescribingUpgradeOrganizationBasket;
Object.defineProperty(exports, "postprocessRadspecDescription", {
  enumerable: true,
  get: function get() {
    return _postprocess.postprocessRadspecDescription;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var radspec = _interopRequireWildcard(require("radspec"));

var _repo = require("../core/apm/repo");

var _utils = require("../utils");

var _apps = require("../utils/apps");

var _intents = require("../utils/intents");

var _postprocess = require("./postprocess");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

async function tryEvaluatingRadspec(intent, wrapper) {
  const apps = await wrapper.apps.pipe((0, _operators.first)()).toPromise();
  const app = apps.find(app => (0, _utils.addressesEqual)(app.proxyAddress, intent.to)); // If the intent matches an installed app, use only that app to search for a
  // method match, otherwise fallback to searching all installed apps

  const appsToSearch = app ? [app] : apps;
  const foundMethod = appsToSearch.reduce((found, app) => {
    if (found) {
      return found;
    }

    const method = (0, _apps.findAppMethodFromData)(app, intent.data);

    if (method) {
      return {
        method,
        abi: app.abi
      };
    }
  }, undefined);
  const {
    abi,
    method
  } = foundMethod || {};
  let evaluatedNotice;

  if (method && method.notice) {
    try {
      evaluatedNotice = await radspec.evaluate(method.notice, {
        abi,
        transaction: intent
      }, {
        ethNode: wrapper.web3.currentProvider
      });
    } catch (err) {}
  }

  return _objectSpread({}, intent, {
    description: evaluatedNotice
  });
}
/**
 * Attempt to describe a setApp() intent. Only describes the APP_BASE namespace.
 *
 * @param  {Object} intent transaction intent
 * @param  {Object} wrapper
 * @return {Promise<Object>} Decorated intent with description, if one could be made
 */


async function tryDescribingUpdateAppIntent(intent, wrapper) {
  const upgradeIntentParams = (await (0, _intents.filterAndDecodeAppUpgradeIntents)([intent], wrapper))[0];
  if (!upgradeIntentParams) return;
  const {
    appId,
    appAddress
  } = upgradeIntentParams; // Fetch aragonPM information

  const repoAddress = await wrapper.ens.resolve(appId);
  const repo = (0, _repo.makeRepoProxy)(repoAddress, wrapper.web3);
  const {
    version: latestVersion
  } = await (0, _repo.getRepoLatestVersionForContract)(repo, appAddress);
  return _objectSpread({}, intent, {
    description: "Upgrade ".concat(appId, " app instances to v").concat(latestVersion)
  });
}
/**
 * Attempt to parse a complete organization upgrade intent
 *
 * @param  {Array<Object>} intents intent basket
 * @param  {Object} wrapper
 * @return {Promise<Object>} Decorated intent with description, if one could be made
 */


async function tryDescribingUpgradeOrganizationBasket(intents, wrapper) {
  const upgradedKnownAppIds = (await (0, _intents.filterAndDecodeAppUpgradeIntents)(intents, wrapper)).map(({
    appId
  }) => appId) // Take intersection with knownAppIds
  .filter(appId => _apps.knownAppIds.includes(appId));

  if ( // All intents are for upgrading known apps
  intents.length === upgradedKnownAppIds.length && // All known apps are being upgraded
  _apps.knownAppIds.length === upgradedKnownAppIds.length) {
    return {
      description: 'Upgrade organization to Aragon 0.8 Camino',
      from: intents[0].from,
      to: intents[0].to
    };
  }
}
//# sourceMappingURL=index.js.map