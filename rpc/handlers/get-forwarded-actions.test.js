"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _getForwardedActions = _interopRequireDefault(require("./get-forwarded-actions"));

var _rxjs = require("rxjs");

(0, _ava.default)('should receive and filter the forwardedActions registry', async t => {
  t.plan(2);
  const mockProxy = {
    address: '0xdeaddead'
  };
  const forwardedActionsObservable = (0, _rxjs.from)([{
    [mockProxy.address]: {
      pending: [{
        // first value
        currentApp: '0xbeefbeef',
        actionId: '1',
        target: '0xdeaddead',
        evmScript: '0x00000001abc',
        state: 0
      }, {
        currentApp: '0xfed',
        actionId: '1',
        target: '0xdeaddead',
        evmScript: '0x00000001xyz',
        state: 2
      }]
    }
  }, {
    '0xbeefdead': {
      pending: [{
        // should filter out this entry
        currentApp: '0xbeefbeef',
        actionId: '1',
        target: '0xbeefdead',
        evmScript: '0x00000001abc',
        state: 0
      }]
    },
    [mockProxy.address]: {
      pending: [{
        // second value
        currentApp: '0xbeefbeef',
        actionId: '1',
        target: '0xdeaddead',
        evmScript: '0x00000001abc',
        state: 0
      }, {
        currentApp: '0xfed',
        actionId: '1',
        target: '0xdeaddead',
        evmScript: '0x00000001xyz',
        state: 2
      }]
    }
  }, {
    '0xbeefdead': {
      pending: [{
        // should not emit an observable for this value
        currentApp: '0xbeefbeef',
        actionId: '1',
        target: '0xbeefdead',
        // target address mismatch
        evmScript: '0x00000001abc',
        state: 0
      }, {
        // missing a target address
        currentApp: '0xbeefbeef',
        actionId: '2',
        evmScript: '0x00000001abc',
        state: 0
      }]
    }
  }]);
  const mockWrapper = {
    forwardedActions: forwardedActionsObservable
  };
  (0, _getForwardedActions.default)(null, mockProxy, mockWrapper).subscribe(value => {
    t.deepEqual(value, {
      event: 'ForwardedActions',
      returnValues: {
        pending: [{
          currentApp: '0xbeefbeef',
          actionId: '1',
          target: '0xdeaddead',
          evmScript: '0x00000001abc',
          state: 0
        }, {
          currentApp: '0xfed',
          actionId: '1',
          target: '0xdeaddead',
          evmScript: '0x00000001xyz',
          state: 2
        }]
      }
    });
  });
});
//# sourceMappingURL=get-forwarded-actions.test.js.map