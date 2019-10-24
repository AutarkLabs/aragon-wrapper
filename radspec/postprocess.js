"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postprocessRadspecDescription = postprocessRadspecDescription;

var _operators = require("rxjs/operators");

var _kernel = require("../core/aragonOS/kernel");

var _utils = require("../utils");

async function postprocessRadspecDescription(description, wrapper) {
  const addressRegexStr = '0x[a-fA-F0-9]{40}';
  const addressRegex = new RegExp("^".concat(addressRegexStr, "$"));
  const bytes32RegexStr = '0x[a-f0-9]{64}';
  const bytes32Regex = new RegExp("^".concat(bytes32RegexStr, "$"));
  const combinedRegex = new RegExp("\\b(".concat(addressRegexStr, "|").concat(bytes32RegexStr, ")\\b"));
  const tokens = description.split(combinedRegex).map(token => token.trim()).filter(token => token);

  if (tokens.length <= 1) {
    return {
      description
    };
  }

  const apps = await wrapper.apps.pipe((0, _operators.first)()).toPromise();
  const roles = apps.map(({
    roles
  }) => roles || []).reduce((acc, roles) => acc.concat(roles), []); // flatten

  const annotateAddress = input => {
    if ((0, _utils.addressesEqual)(input, _utils.ANY_ENTITY)) {
      return [input, "'Any account'", {
        type: 'any-account',
        value: _utils.ANY_ENTITY
      }];
    }

    const app = apps.find(({
      proxyAddress
    }) => (0, _utils.addressesEqual)(proxyAddress, input));

    if (app) {
      const replacement = "".concat(app.name).concat(app.identifier ? " (".concat(app.identifier, ")") : '');
      return [input, "'".concat(replacement, "'"), {
        type: 'app',
        value: app
      }];
    }

    return [input, input, {
      type: 'address',
      value: input
    }];
  };

  const annotateBytes32 = input => {
    const role = roles.find(({
      bytes
    }) => bytes === input);

    if (role && role.name) {
      return [input, "'".concat(role.name, "'"), {
        type: 'role',
        value: role
      }];
    }

    const app = apps.find(({
      appId
    }) => appId === input);

    if (app) {
      // return the entire app as it contains APM package details
      return [input, "'".concat(app.appName, "'"), {
        type: 'apmPackage',
        value: app
      }];
    }

    const namespace = (0, _kernel.getKernelNamespace)(input);

    if (namespace) {
      return [input, "'".concat(namespace.name, "'"), {
        type: 'kernelNamespace',
        value: namespace
      }];
    }

    return [input, input, {
      type: 'bytes32',
      value: input
    }];
  };

  const annotateText = input => {
    return [input, input, {
      type: 'text',
      value: input
    }];
  };

  const annotatedTokens = tokens.map(token => {
    if (addressRegex.test(token)) {
      return annotateAddress(token);
    }

    if (bytes32Regex.test(token)) {
      return annotateBytes32(token);
    }

    return annotateText(token);
  });
  const compiled = annotatedTokens.reduce((acc, [_, replacement, annotation]) => {
    acc.description.push(replacement);
    acc.annotatedDescription.push(annotation);
    return acc;
  }, {
    annotatedDescription: [],
    description: []
  });
  return {
    annotatedDescription: compiled.annotatedDescription,
    description: compiled.description.join(' ')
  };
}
//# sourceMappingURL=postprocess.js.map