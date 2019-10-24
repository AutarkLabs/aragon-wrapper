"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var _rxjs = require("rxjs");

var _rpcMessenger = require("@aragon/rpc-messenger");

var _index = require("./index");

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('should create a request handler', async t => {
  t.plan(8); // arrange

  const requestStub = (0, _rxjs.from)([{
    request: {
      id: 'uuid0',
      // this one should get filtered away
      method: 'accounts'
    }
  }, {
    request: {
      id: 'uuid1',
      method: 'cache',
      params: ['get', 'settings']
    }
  }, {
    request: {
      id: 'uuid4',
      method: 'cache',
      params: ['set', 'settings'],
      value: {
        foo: 'bar'
      }
    }
  }, {
    request: {
      id: 'uuid5',
      method: 'cache',
      params: ['clear']
    }
  }, {
    request: {
      id: 'uuid6',
      method: 'cache',
      params: ['get', 'profile']
    }
  }, {
    request: {
      // this one should NOT get filtered away, but assigned a default response of null
      id: 'uuid8',
      method: 'cache'
    }
  }]);

  const handlerStub = request => {
    if (request.id === 'uuid8') {
      // undefined result, this will get converted into null so it can be transmited over JSON RPC
      return Promise.resolve();
    }

    if (request.params[0] === 'set') {
      return Promise.reject(new Error("no permissions to change ".concat(request.params[1], "!!")));
    }

    if (request.params[0] === 'clear') {
      return Promise.reject(new Error());
    }

    return Promise.resolve("resolved ".concat(request.params[1]));
  }; // act


  const result = (0, _index.createRequestHandler)(requestStub, 'cache', handlerStub); // assert

  const completed = new Set();
  result.subscribe({
    next(value) {
      if (value.payload === _rpcMessenger.signals.COMPLETE) {
        if (completed.has(value.id)) {
          t.fail("request (".concat(value.id, ") completed twice"));
        }

        completed.add(value.id);
        return;
      }

      if (value.id === 'uuid1') {
        return t.is(value.payload, 'resolved settings');
      }

      if (value.id === 'uuid4') {
        t.is(value.payload.message, 'no permissions to change settings!!');
        return t.true(value.payload instanceof Error);
      }

      if (value.id === 'uuid5') {
        t.is(value.payload.message, '');
        return t.true(value.payload instanceof Error);
      }

      if (value.id === 'uuid6') {
        return t.is(value.payload, 'resolved profile');
      }

      if (value.id === 'uuid8') {
        return t.is(value.payload, null);
      }
    },

    // Check non-erroring requests completed correctly
    complete() {
      return t.deepEqual([...completed].sort(), ['uuid1', 'uuid6', 'uuid8']);
    }

  });
});
(0, _ava.default)('should combine request handlers', async t => {
  t.plan(2); // arrange

  const handlerA = (0, _rxjs.of)('handler for A');
  const handlerB = (0, _rxjs.of)('handler for B'); // act

  const result = (0, _index.combineRequestHandlers)(handlerA, handlerB); // assert

  result.subscribe(value => {
    t.true(value === 'handler for A' || value === 'handler for B');
  });
});
//# sourceMappingURL=index.test.js.map