"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmInternalAppInfo = getApmInternalAppInfo;
exports.default = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _repo = require("./repo");

var _interfaces = require("../../interfaces");

var _FileFetcher = _interopRequireDefault(require("../../utils/FileFetcher"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const DEFAULT_FETCH_TIMEOUT = 10000; // 10s

function getApmInternalAppInfo(appId) {
  return (0, _interfaces.getAppInfo)(appId, 'apm');
}

async function fetchRepoContentFromVersion(fetcher, versionData, {
  fetchTimeout
}) {
  const {
    contentURI,
    contractAddress,
    version
  } = versionData;
  let appContent;

  try {
    appContent = await (0, _repo.fetchRepoContentURI)(fetcher, contentURI, {
      fetchTimeout
    });
  } catch (err) {
    console.warn('Fetching repo content failed', err);
  }

  return _objectSpread({}, appContent, {
    contractAddress,
    version
  });
}

function _default(web3, {
  ipfsGateway,
  fetchTimeout = DEFAULT_FETCH_TIMEOUT
} = {}) {
  const fetcher = new _FileFetcher.default({
    ipfsGateway
  });
  return {
    getContentPath: ({
      location,
      provider
    }, path) => fetcher.getFullPath(provider, location, path),
    fetchLatestRepoContent: async (repoAddress, options) => {
      const repo = (0, _repo.makeRepoProxy)(repoAddress, web3);
      return fetchRepoContentFromVersion(fetcher, (await (0, _repo.getRepoLatestVersion)(repo)), _objectSpread({
        fetchTimeout
      }, options));
    },
    fetchLatestRepoContentForContract: async (repoAddress, codeAddress, options) => {
      const repo = (0, _repo.makeRepoProxy)(repoAddress, web3);
      return fetchRepoContentFromVersion(fetcher, (await (0, _repo.getRepoLatestVersionForContract)(repo, codeAddress)), _objectSpread({
        fetchTimeout
      }, options));
    }
  };
}
//# sourceMappingURL=index.js.map