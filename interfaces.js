"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppInfo = getAppInfo;
exports.hasAppInfo = hasAppInfo;
exports.getArtifact = exports.getAbi = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _apps = require("./utils/apps");

var _ACL = _interopRequireDefault(require("@aragon/os/abi/ACL"));

var _AppProxyBase = _interopRequireDefault(require("@aragon/os/abi/AppProxyBase"));

var _ERCProxy = _interopRequireDefault(require("@aragon/os/abi/ERCProxy"));

var _IForwarder = _interopRequireDefault(require("@aragon/os/abi/IForwarder"));

var _IForwarderFee = _interopRequireDefault(require("@aragon/os/abi/IForwarderFee"));

var _Kernel = _interopRequireDefault(require("@aragon/os/abi/Kernel"));

var _EVMScriptRegistry = _interopRequireDefault(require("@aragon/os/abi/EVMScriptRegistry"));

var _ERC = _interopRequireDefault(require("@aragon/os/abi/ERC20"));

var _APMRegistry = _interopRequireDefault(require("@aragon/os/abi/APMRegistry"));

var _Repo = _interopRequireDefault(require("@aragon/os/abi/Repo"));

var _ENSSubdomainRegistrar = _interopRequireDefault(require("@aragon/os/abi/ENSSubdomainRegistrar"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Artifacts
const artifactsAragonACL = {
  appName: "acl.aragonpm.eth",
  roles: [{
    name: "Create permissions",
    id: "CREATE_PERMISSIONS_ROLE",
    bytes: "0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a"
  }],
  functions: [{
    sig: "initialize(address)",
    roles: [],
    notice: "Initializes an ACL instance and sets `_permissionsCreator` as the entity that can create other permissions"
  }, {
    sig: "createPermission(address,address,bytes32,address)",
    roles: ["CREATE_PERMISSIONS_ROLE"],
    notice: "Create a new permission granting `_entity` the ability to perform actions of role `_role` on `_app` (setting `_manager` as the permission manager)"
  }, {
    sig: "grantPermission(address,address,bytes32)",
    roles: [],
    notice: "Grants `_entity` the ability to perform actions of role `_role` on `_app`"
  }, {
    sig: "grantPermissionP(address,address,bytes32,uint256[])",
    roles: [],
    notice: "Grants `_entity` the ability to perform actions of role `_role` on `_app`"
  }, {
    sig: "revokePermission(address,address,bytes32)",
    roles: [],
    notice: "Revokes `_entity` the ability to perform actions of role `_role` on `_app`"
  }, {
    sig: "setPermissionManager(address,address,bytes32)",
    roles: [],
    notice: "Sets `_newManager` as the manager of the permission `_role` in `_app`"
  }, {
    sig: "removePermissionManager(address,bytes32)",
    roles: [],
    notice: "Removes the manager of the permission `_role` in `_app`"
  }, {
    sig: "getPermissionParam(address,address,address)",
    roles: [],
    notice: "Get parameter for permission"
  }, {
    sig: "_evalLogic(address,bytes32,address,address,bytes32,uint256[])",
    roles: [],
    notice: null
  }, {
    sig: "transferToVault(address)",
    roles: [],
    notice: "Send funds to recovery Vault. This contract should never receive funds, but in case it does, this function allows one to recover them."
  }]
};
const artifactsAragonKernel = {
  appName: "kernel.aragonpm.eth",
  roles: [{
    name: "Manage apps",
    id: "APP_MANAGER_ROLE",
    bytes: "0xb6d92708f3d4817afc106147d969e229ced5c46e65e0a5002a0d391287762bd0"
  }],
  functions: [{
    sig: "initialize(address,address)",
    roles: [],
    notice: "Initializes a kernel instance along with its ACL and sets `_permissionsCreator` as the entity that can create other permissions"
  }, {
    sig: "newAppInstance(bytes32,address)",
    roles: ["APP_MANAGER_ROLE"],
    notice: "Create a new upgradeable instance of `_appId` app linked to the Kernel, setting its code to `_appBase`"
  }, {
    sig: "newAppInstance(bytes32,address,bytes,bool)",
    roles: ["APP_MANAGER_ROLE"],
    notice: "Create a new upgradeable instance of `_appId` app linked to the Kernel, setting its code to `_appBase`. `_setDefault ? 'Also sets it as the default app instance.':''`"
  }, {
    sig: "newPinnedAppInstance(bytes32,address)",
    roles: ["APP_MANAGER_ROLE"],
    notice: "Create a new non-upgradeable instance of `_appId` app linked to the Kernel, setting its code to `_appBase`."
  }, {
    sig: "newPinnedAppInstance(bytes32,address,bytes,bool)",
    roles: ["APP_MANAGER_ROLE"],
    notice: "Create a new non-upgradeable instance of `_appId` app linked to the Kernel, setting its code to `_appBase`. `_setDefault ? 'Also sets it as the default app instance.':''`"
  }, {
    sig: "setApp(bytes32,bytes32,address)",
    roles: ["APP_MANAGER_ROLE"],
    notice: "Set the resolving address of `_appId` in namespace `_namespace` to `_app`"
  }, {
    sig: "setRecoveryVaultAppId(bytes32)",
    roles: ["APP_MANAGER_ROLE"],
    notice: null
  }, {
    sig: "transferToVault(address)",
    roles: [],
    notice: "Send funds to recovery Vault. This contract should never receive funds, but in case it does, this function allows one to recover them."
  }]
};
const artifactsAragonEVMScriptRegistry = {
  appName: "evmreg.aragonpm.eth",
  roles: [{
    name: "Add executors",
    id: "REGISTRY_ADD_EXECUTOR_ROLE",
    bytes: "0xc4e90f38eea8c4212a009ca7b8947943ba4d4a58d19b683417f65291d1cd9ed2"
  }, {
    name: "Enable and disable executors",
    id: "REGISTRY_MANAGER_ROLE",
    bytes: "0xf7a450ef335e1892cb42c8ca72e7242359d7711924b75db5717410da3f614aa3"
  }],
  functions: [{
    sig: "initialize()",
    roles: [],
    notice: "Initialize the registry"
  }, {
    sig: "addScriptExecutor(address)",
    roles: ["REGISTRY_ADD_EXECUTOR_ROLE"],
    notice: "Add a new script executor with address `_executor` to the registry"
  }, {
    sig: "disableScriptExecutor(uint256)",
    roles: ["REGISTRY_MANAGER_ROLE"],
    notice: "Disable script executor with ID `_executorId`"
  }, {
    sig: "enableScriptExecutor(uint256)",
    roles: ["REGISTRY_MANAGER_ROLE"],
    notice: "Enable script executor with ID `_executorId`"
  }, {
    sig: "transferToVault(address)",
    roles: [],
    notice: "Send funds to recovery Vault. This contract should never receive funds, but in case it does, this function allows one to recover them."
  }]
};
const artifactsApmRegistry = {
  appName: "apm-registry.aragonpm.eth",
  roles: [{
    id: "CREATE_REPO_ROLE",
    bytes: "0x2a9494d64846c9fdbf0158785aa330d8bc9caf45af27fa0e8898eb4d55adcea6",
    name: "Create repos",
    params: []
  }],
  functions: [{
    sig: "initialize(address)",
    roles: [],
    notice: "Initialize this APMRegistry instance and set `_registrar` as the ENS subdomain registrar"
  }, {
    sig: "newRepo(string,address)",
    roles: ["CREATE_REPO_ROLE"],
    notice: "Create new repo in registry with `_name`"
  }, {
    sig: "newRepoWithVersion(string,address,uint16[3],address,bytes)",
    roles: ["CREATE_REPO_ROLE"],
    notice: "Create new repo in registry with `_name` and publish a first version with contract `_contractAddress` and content `@fromHex(_contentURI)`"
  }]
};
const artifactsApmRepo = {
  appName: "apm-repo.aragonpm.eth",
  roles: [{
    id: "CREATE_VERSION_ROLE",
    bytes: "0x1f56cfecd3595a2e6cc1a7e6cb0b20df84cdbd92eff2fee554e70e4e45a9a7d8",
    name: "Publish versions",
    params: []
  }],
  functions: [{
    sig: "initialize()",
    roles: [],
    notice: "Initialize this Repo"
  }, {
    sig: "newVersion(uint16[3],address,bytes)",
    roles: ["CREATE_VERSION_ROLE"],
    notice: "Create new version with contract `_contractAddress` and content `@fromHex(_contentURI)`"
  }]
};
const artifactsApmEnsSubdomainRegistrar = {
  appName: "apm-enssub.aragonpm.eth",
  roles: [{
    id: "CREATE_NAME_ROLE",
    bytes: "0xf86bc2abe0919ab91ef714b2bec7c148d94f61fdb069b91a6cfe9ecdee1799ba",
    name: "Create subdomains",
    params: []
  }, {
    id: "DELETE_NAME_ROLE",
    bytes: "0x03d74c8724218ad4a99859bcb2d846d39999449fd18013dd8d69096627e68622",
    name: "Remove subdomains",
    params: []
  }, {
    id: "POINT_ROOTNODE_ROLE",
    bytes: "0x9ecd0e7bddb2e241c41b595a436c4ea4fd33c9fa0caa8056acf084fc3aa3bfbe",
    name: "Point root domain",
    params: []
  }],
  functions: [{
    sig: "initialize(address,bytes32)",
    roles: [],
    notice: "Initialize this ENSSubdomainRegistrar instance with `_ens` as the root ENS registry and `_rootNode` as the node to allocate subdomains under"
  }, {
    sig: "createName(bytes32,address)",
    roles: ["CREATE_NAME_ROLE"],
    notice: "Create a new ENS subdomain record for `_label` and assign ownership to `_owner`"
  }, {
    sig: "createNameAndPoint(bytes32,address)",
    roles: ["CREATE_NAME_ROLE"],
    notice: "Create a new ENS subdomain record for `_label` that resolves to `_target` and is owned by this ENSSubdomainRegistrar"
  }, {
    sig: "deleteName(bytes32)",
    roles: ["DELETE_NAME_ROLE"],
    notice: "Deregister ENS subdomain record for `_label`"
  }, {
    sig: "pointRootNode(address)",
    roles: ["POINT_ROOTNODE_ROLE"],
    notice: "Resolve this ENSSubdomainRegistrar's root node to `_target`"
  }]
};
const ABIS = {
  'aragon/ACL': _ACL.default.abi,
  'aragon/AppProxy': _AppProxyBase.default.abi,
  'aragon/ERCProxy': _ERCProxy.default.abi,
  'aragon/Forwarder': _IForwarder.default.abi,
  'aragon/ForwarderFee': _IForwarderFee.default.abi,
  'aragon/Kernel': _Kernel.default.abi,
  'aragon/EVM Script Registry': _EVMScriptRegistry.default.abi,
  'apm/APM Registry': _APMRegistry.default.abi,
  'apm/Repo': _Repo.default.abi,
  'apm/ENS Subdomain Registrar': _ENSSubdomainRegistrar.default.abi,
  'standard/ERC20': _ERC.default.abi
};
const ARTIFACTS = {
  'aragon/ACL': artifactsAragonACL,
  'aragon/Kernel': artifactsAragonKernel,
  'aragon/EVM Script Registry': artifactsAragonEVMScriptRegistry,
  'apm/APM Registry': artifactsApmRegistry,
  'apm/Repo': artifactsApmRepo,
  'apm/ENS Subdomain Registrar': artifactsApmEnsSubdomainRegistrar
};
const SYSTEM_APP_MAPPINGS = new Map([[(0, _apps.apmAppId)('acl'), 'ACL'], [(0, _apps.apmAppId)('evmreg'), 'EVM Script Registry'], [(0, _apps.apmAppId)('kernel'), 'Kernel']]);
const APM_APP_MAPPINGS = new Map([[(0, _apps.apmAppId)('apm-registry'), 'APM Registry'], [(0, _apps.apmAppId)('apm-repo'), 'Repo'], [(0, _apps.apmAppId)('apm-enssub'), 'ENS Subdomain Registrar'], // Support open.aragonpm.eth's native packages
// Note that these were erroneously deployed on the open.aragonpm.eth instance rather than
// reusing the aragonpm.eth versions
[(0, _apps.apmAppId)('apm-registry.open'), 'APM Registry'], [(0, _apps.apmAppId)('apm-repo.open'), 'Repo'], [(0, _apps.apmAppId)('apm-enssub.open'), 'ENS Subdomain Registrar'], // Support hatch.aragonpm.eth's native packages (see note above for `open.aragonpm.eth`)
[(0, _apps.apmAppId)('apm-registry.hatch'), 'APM Registry'], [(0, _apps.apmAppId)('apm-repo.hatch'), 'Repo'], [(0, _apps.apmAppId)('apm-enssub.hatch'), 'ENS Subdomain Registrar']]);
const APP_NAMESPACE_MAPPINGS = new Map([['aragon', SYSTEM_APP_MAPPINGS], ['apm', APM_APP_MAPPINGS]]);

const getAbi = name => ABIS[name] || null;

exports.getAbi = getAbi;

const getArtifact = name => ARTIFACTS[name] || null;

exports.getArtifact = getArtifact;

function getAppInfo(appId, namespace) {
  const nameMapping = APP_NAMESPACE_MAPPINGS.get(namespace);

  if (!nameMapping || !nameMapping.has(appId)) {
    return null;
  }

  const name = nameMapping.get(appId);
  const app = "".concat(namespace, "/").concat(name);
  const abi = getAbi(app);
  const artifact = getArtifact(app);
  return _objectSpread({
    abi,
    name
  }, artifact);
}

function hasAppInfo(appId, namespace) {
  const mapping = APP_NAMESPACE_MAPPINGS.get(namespace);
  return Boolean(mapping) && mapping.has(appId);
}
//# sourceMappingURL=interfaces.js.map