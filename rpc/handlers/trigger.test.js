"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _trigger = require("./trigger");

var _rxjs = require("rxjs");

(0, _ava.default)('should receive and filter through correct trigger events', async t => {
  t.plan(1);
  const mockProxy = {
    address: '0xdeaddead'
  };
  const triggerEventObservable = (0, _rxjs.from)([{
    origin: '0x0',
    frontendEvent: {
      event: 'TriggerTest',
      returnValues: {
        testVal: 1
      }
    }
  }, {
    origin: mockProxy.address,
    frontendEvent: {
      event: 'TriggerTest',
      returnValues: {
        testVal: 1
      }
    }
  }]);
  const mockWrapper = {
    trigger: triggerEventObservable
  };
  (0, _trigger.triggerSubscribe)(null, mockProxy, mockWrapper).subscribe(value => {
    t.deepEqual(value, {
      event: 'TriggerTest',
      returnValues: {
        testVal: 1
      }
    });
  });
});
//# sourceMappingURL=trigger.test.js.map