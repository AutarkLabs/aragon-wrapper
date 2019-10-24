"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var _proxyquire = _interopRequireDefault(require("proxyquire"));

_ava.default.beforeEach(t => {
  const ethjsEnsStub = _sinon.default.stub();

  const ens = _proxyquire.default.noCallThru().load('./index', {
    'ethjs-ens': ethjsEnsStub
  });

  t.context = {
    ens,
    ethjsEnsStub
  };
});

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('should lookup name', t => {
  const {
    ens,
    ethjsEnsStub
  } = t.context; // arrange

  const options = {
    provider: {
      sendAsync: 2
    }
  };
  ethjsEnsStub.prototype.lookup = _sinon.default.stub().returns('0x01'); // act

  const result = ens.resolve('aragon.eth', options); // assert

  t.is(result, '0x01');
  t.is(ethjsEnsStub.prototype.lookup.getCall(0).args[0], 'aragon.eth');
  t.is(ethjsEnsStub.getCall(0).args[0], options);
});
(0, _ava.default)('should resolve address for node', t => {
  const {
    ens,
    ethjsEnsStub
  } = t.context; // arrange

  const hackyOptions = {
    provider: {
      sendAsync: undefined
    }
  };
  ethjsEnsStub.prototype.resolveAddressForNode = _sinon.default.stub().returns('0x02'); // act

  const result = ens.resolve('node'); // assert

  t.is(result, '0x02');
  t.is(ethjsEnsStub.prototype.resolveAddressForNode.getCall(0).args[0], 'node');
  t.deepEqual(ethjsEnsStub.getCall(0).args[0], hackyOptions);
});
//# sourceMappingURL=index.test.js.map