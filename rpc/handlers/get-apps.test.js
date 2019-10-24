"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var _rxjs = require("rxjs");

var _getApps = _interopRequireDefault(require("./get-apps"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('should return a subscription for the entire app list if observing all', async t => {
  t.plan(2); // arrange

  const initialApps = [{
    appId: 'coolApp',
    kernelAddress: '0x123',
    contractAddress: '0xcoolApp',
    abi: 'abi for coolApp',
    isForwarder: false,
    name: 'Cool App',
    proxyAddress: '0x456',
    icons: [{
      src: 'icon_link'
    }]
  }];
  const appsMock = new _rxjs.BehaviorSubject(initialApps);
  const identifiersMock = (0, _rxjs.of)({
    '0x456': 'cool identifier',
    '0x789': 'voting identifier'
  });
  const requestStub = {
    params: ['observe', 'all']
  };
  const proxyStub = {};
  const wrapperStub = {
    apm: {
      getContentPath: (content, path) => "url/".concat(path)
    },
    apps: appsMock,
    appIdentifiers: identifiersMock
  }; // act

  const result = await (0, _getApps.default)(requestStub, proxyStub, wrapperStub); // assert

  const expectedInitialApps = [{
    appAddress: '0x456',
    appId: 'coolApp',
    appImplementationAddress: '0xcoolApp',
    identifier: 'cool identifier',
    isForwarder: false,
    kernelAddress: '0x123',
    name: 'Cool App',
    icons: [{
      src: 'url/icon_link'
    }]
  }];
  const expectedEndApps = [].concat(expectedInitialApps, {
    appAddress: '0x789',
    appId: 'votingApp',
    appImplementationAddress: '0xvotingApp',
    identifier: 'voting identifier',
    isForwarder: true,
    kernelAddress: '0x123',
    name: 'Voting App',
    icons: [{
      src: 'url/icon_link'
    }]
  });
  let emitIndex = 0;
  result.subscribe(value => {
    if (emitIndex === 0) {
      t.deepEqual(value, expectedInitialApps);
    } else if (emitIndex === 1) {
      t.deepEqual(value, expectedEndApps);
    } else {
      t.fail('too many emissions');
    }

    emitIndex++;
  }); // We need apps' second emission to fire after the identifiers have emitted,
  // so that the combineLatest doesn't skip the initial value

  const endApps = [].concat(initialApps, {
    appId: 'votingApp',
    kernelAddress: '0x123',
    contractAddress: '0xvotingApp',
    abi: 'abi for votingApp',
    isForwarder: true,
    name: 'Voting App',
    proxyAddress: '0x789',
    icons: [{
      src: 'icon_link'
    }]
  });
  appsMock.next(endApps);
});
(0, _ava.default)('should return a subscription for the entire app list via initial RPC API', async t => {
  t.plan(2); // arrange

  const initialApps = [{
    appId: 'coolApp',
    kernelAddress: '0x123',
    contractAddress: '0xcoolApp',
    abi: 'abi for coolApp',
    isForwarder: false,
    name: 'Cool App',
    icon: 'icon link',
    proxyAddress: '0x456'
  }];
  const endApps = [].concat(initialApps, {
    appId: 'votingApp',
    kernelAddress: '0x123',
    contractAddress: '0xvotingApp',
    abi: 'abi for votingApp',
    isForwarder: true,
    name: 'Voting App',
    icon: 'icon link',
    proxyAddress: '0x789'
  });
  const appsMock = (0, _rxjs.of)(initialApps, endApps);
  const requestStub = {
    params: []
  };
  const proxyStub = {};
  const wrapperStub = {
    apps: appsMock
  }; // act

  const result = await (0, _getApps.default)(requestStub, proxyStub, wrapperStub); // assert

  let emitIndex = 0;
  result.subscribe(value => {
    if (emitIndex === 0) {
      t.deepEqual(value, initialApps);
    } else if (emitIndex === 1) {
      t.deepEqual(value, endApps);
    } else {
      t.fail('too many emissions');
    }

    emitIndex++;
  });
});
(0, _ava.default)('should return the initial value for the entire app list if getting all', async t => {
  t.plan(1); // arrange

  const initialApps = [{
    appId: 'coolApp',
    kernelAddress: '0x123',
    contractAddress: '0xcoolApp',
    abi: 'abi for coolApp',
    isForwarder: false,
    name: 'Cool App',
    proxyAddress: '0x456',
    icons: [{
      src: 'icon_link'
    }]
  }];
  const appsMock = new _rxjs.BehaviorSubject(initialApps);
  const identifiersMock = (0, _rxjs.of)({
    '0x456': 'cool identifier',
    '0x789': 'voting identifier'
  });
  const requestStub = {
    params: ['get', 'all']
  };
  const proxyStub = {};
  const wrapperStub = {
    apm: {
      getContentPath: (content, path) => "url/".concat(path)
    },
    apps: appsMock,
    appIdentifiers: identifiersMock
  }; // act

  const result = await (0, _getApps.default)(requestStub, proxyStub, wrapperStub); // assert

  const expectedApps = [{
    appAddress: '0x456',
    appId: 'coolApp',
    appImplementationAddress: '0xcoolApp',
    identifier: 'cool identifier',
    isForwarder: false,
    kernelAddress: '0x123',
    name: 'Cool App',
    icons: [{
      src: 'url/icon_link'
    }]
  }];
  let emitIndex = 0;
  result.subscribe(value => {
    if (emitIndex === 0) {
      t.deepEqual(value, expectedApps);
    } else {
      t.fail('too many emissions');
    }

    emitIndex++;
  }); // Even though this is filtered out, we need apps' second emission to fire after the identifiers
  // have emitted, so that the combineLatest doesn't skip the initial value

  const endApps = [].concat(initialApps, {
    appId: 'votingApp',
    kernelAddress: '0x123',
    contractAddress: '0xvotingApp',
    abi: 'abi for votingApp',
    isForwarder: true,
    name: 'Voting App',
    proxyAddress: '0x789',
    icons: [{
      src: 'icon_link'
    }]
  });
  appsMock.next(endApps);
});
(0, _ava.default)('should return a subscription for just the current app if observing current', async t => {
  t.plan(2); // arrange

  const currentAppAddress = '0x456';
  const initialApp = {
    appId: 'coolApp',
    contractAddress: '0xcoolApp',
    kernelAddress: '0x123',
    abi: 'abi for coolApp',
    isForwarder: false,
    name: 'Cool App',
    proxyAddress: currentAppAddress,
    icons: [{
      src: 'icon_link'
    }]
  };
  const appsMock = new _rxjs.BehaviorSubject([initialApp]);
  const identifiersMock = (0, _rxjs.of)({
    '0x456': 'cool identifier'
  });
  const requestStub = {
    params: ['observe', 'current']
  };
  const proxyStub = {
    address: currentAppAddress
  };
  const wrapperStub = {
    apm: {
      getContentPath: (content, path) => "url/".concat(path)
    },
    apps: appsMock,
    appIdentifiers: identifiersMock
  }; // act

  const result = await (0, _getApps.default)(requestStub, proxyStub, wrapperStub); // assert

  let emitIndex = 0;
  result.subscribe(value => {
    if (emitIndex === 0) {
      t.deepEqual(value, {
        appAddress: currentAppAddress,
        appId: 'coolApp',
        appImplementationAddress: '0xcoolApp',
        identifier: 'cool identifier',
        isForwarder: false,
        kernelAddress: '0x123',
        name: 'Cool App',
        icons: [{
          src: 'url/icon_link'
        }]
      });
    } else if (emitIndex === 1) {
      t.deepEqual(value, {
        appAddress: currentAppAddress,
        appId: 'new coolApp',
        appImplementationAddress: '0xcoolApp',
        identifier: 'cool identifier',
        isForwarder: false,
        kernelAddress: '0x123',
        name: 'Cool App',
        icons: [{
          src: 'url/icon_link'
        }]
      });
    } else {
      t.fail('too many emissions');
    }

    emitIndex++;
  }); // We need apps' second emission to fire after the identifiers have emitted,
  // so that the combineLatest doesn't skip the initial value

  const endApp = _objectSpread({}, initialApp, {
    appId: 'new coolApp'
  });

  appsMock.next([// This extra app should be filtered out
  {
    appId: 'votingApp',
    kernelAddress: '0x123',
    contractAddress: '0xvotingApp',
    abi: 'abi for votingApp',
    isForwarder: true,
    name: 'Voting App',
    proxyAddress: '0x789',
    icons: [{
      src: 'icon_link'
    }]
  }, endApp]);
});
(0, _ava.default)('should return the initial value for just the current app if getting current', async t => {
  t.plan(1); // arrange

  const currentAppAddress = '0x456';
  const initialApp = {
    appId: 'coolApp',
    contractAddress: '0xcoolApp',
    kernelAddress: '0x123',
    abi: 'abi for coolApp',
    isForwarder: false,
    name: 'Cool App',
    proxyAddress: currentAppAddress,
    icons: [{
      src: 'icon_link'
    }]
  };

  const endApp = _objectSpread({}, initialApp, {
    appId: 'new coolApp'
  });

  const appsMock = new _rxjs.BehaviorSubject([initialApp]);
  const identifiersMock = (0, _rxjs.of)({
    '0x456': 'cool identifier'
  });
  const requestStub = {
    params: ['get', 'current']
  };
  const proxyStub = {
    address: currentAppAddress
  };
  const wrapperStub = {
    apm: {
      getContentPath: (content, path) => "url/".concat(path)
    },
    apps: appsMock,
    appIdentifiers: identifiersMock
  }; // act

  const result = await (0, _getApps.default)(requestStub, proxyStub, wrapperStub); // assert

  let emitIndex = 0;
  result.subscribe(value => {
    if (emitIndex === 0) {
      t.deepEqual(value, {
        appAddress: currentAppAddress,
        appId: 'coolApp',
        appImplementationAddress: '0xcoolApp',
        identifier: 'cool identifier',
        isForwarder: false,
        kernelAddress: '0x123',
        name: 'Cool App',
        icons: [{
          src: 'url/icon_link'
        }]
      });
    } else {
      t.fail('too many emissions');
    }

    emitIndex++;
  }); // Even though this is filtered out, we need apps' second emission to fire after the identifiers
  // have emitted, so that the combineLatest doesn't skip the initial value

  appsMock.next([endApp]);
});
//# sourceMappingURL=get-apps.test.js.map