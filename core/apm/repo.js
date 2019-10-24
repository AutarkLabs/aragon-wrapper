"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRepoProxy = makeRepoProxy;
exports.getAllRepoVersions = getAllRepoVersions;
exports.getRepoLatestVersion = getRepoLatestVersion;
exports.getRepoLatestVersionForContract = getRepoLatestVersionForContract;
exports.getRepoVersionById = getRepoVersionById;
exports.fetchRepoContentURI = fetchRepoContentURI;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _web3Utils = require("web3-utils");

var _interfaces = require("../../interfaces");

var _utils = require("../../utils");

var _promiseTimeout = _interopRequireDefault(require("../../utils/promise-timeout"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function makeRepoProxy(address, web3, options) {
  return (0, _utils.makeProxyFromABI)(address, (0, _interfaces.getAbi)('apm/Repo'), web3, options);
}

async function getAllRepoVersions(repoProxy) {
  const versions = [];
  const versionCount = await repoProxy.call('getVersionsCount'); // Versions index starts at 1

  for (let versionId = 1; versionId <= versionCount; ++versionId) {
    versions.push((await getRepoVersionById(repoProxy, versionId)));
  }

  return Promise.all(versions);
}

async function getRepoLatestVersion(repoProxy) {
  const {
    contentURI,
    contractAddress,
    semanticVersion
  } = await repoProxy.call('getLatest');
  return {
    contractAddress,
    contentURI: (0, _web3Utils.hexToAscii)(contentURI),
    version: semanticVersion.join('.')
  };
}

async function getRepoLatestVersionForContract(repoProxy, appContractAddress) {
  const {
    contentURI,
    contractAddress,
    semanticVersion
  } = await repoProxy.call('getLatestForContractAddress', appContractAddress);
  return {
    contractAddress,
    contentURI: (0, _web3Utils.hexToAscii)(contentURI),
    version: semanticVersion.join('.')
  };
}

async function getRepoVersionById(repoProxy, versionId) {
  const {
    contentURI,
    contractAddress,
    semanticVersion
  } = await repoProxy.call('getByVersionId', versionId);
  return {
    contractAddress,
    contentURI: (0, _web3Utils.hexToAscii)(contentURI),
    version: semanticVersion.join('.'),
    // Keeping this as a string makes comparisons a bit easier down the line
    versionId: versionId.toString()
  };
}

async function fetchRepoContentURI(fileFetcher, contentURI, {
  fetchTimeout
} = {}) {
  const [provider, location] = contentURI.split(/:(.+)/);

  if (!provider || !location) {
    throw new Error("contentURI invalid: ".concat(contentURI));
  } else if (!fileFetcher.supportsProvider(provider)) {
    throw new Error("Provider not supported: ".concat(provider));
  }

  let files;

  try {
    let filesFetch = Promise.all([fileFetcher.fetch(provider, location, 'manifest.json'), fileFetcher.fetch(provider, location, 'artifact.json')]);

    if (Number.isFinite(fetchTimeout) && fetchTimeout > 0) {
      filesFetch = (0, _promiseTimeout.default)(filesFetch, fetchTimeout);
    }

    files = (await filesFetch).map(JSON.parse);
  } catch (err) {
    if (err instanceof SyntaxError) {
      // JSON parse error
      console.warn("Fetch failed: ".concat(contentURI, " was not JSON-parsable"), err);
    } // Fetch failed or timed out


    return {
      content: {
        provider,
        location
      }
    };
  }

  const [manifest, artifact] = files;
  return _objectSpread({}, manifest, {}, artifact, {
    content: {
      provider,
      location
    }
  });
}
//# sourceMappingURL=repo.js.map