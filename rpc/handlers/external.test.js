"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _proxyquire = _interopRequireDefault(require("proxyquire"));

var _sinon = _interopRequireDefault(require("sinon"));

var _events = require("events");

var configurationKeys = _interopRequireWildcard(require("../../configuration/keys"));

var eventsUtils = _interopRequireWildcard(require("../../utils/events"));

_ava.default.beforeEach(t => {
  const configurationStub = {
    getConfiguration: _sinon.default.stub()
  };
  const utilsStub = {
    events: eventsUtils
  };
  const external = (0, _proxyquire.default)('./external', {
    '../../configuration': configurationStub,
    '../../utils': utilsStub
  });
  t.context = {
    external,
    configurationStub,
    utilsStub
  };
});

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('should return the correct tx path from external tx intent', async t => {
  const {
    external
  } = t.context;
  const targetAddr = '0x123';
  const targetMethodJsonDescription = [{
    name: 'foo'
  }];
  const targetParams = [8];
  const mockPath = [{
    to: '0x123',
    data: '0x456'
  }];
  t.plan(3); // arrange

  const wrapperStub = {
    getExternalTransactionPath: _sinon.default.stub().returns(mockPath),
    performTransactionPath: _sinon.default.stub().returns(Promise.resolve())
  };
  const requestStub = {
    params: [targetAddr, targetMethodJsonDescription, ...targetParams]
  }; // act

  const result = external.intent(requestStub, null, wrapperStub); // assert

  await t.notThrowsAsync(result);
  t.true(wrapperStub.getExternalTransactionPath.calledOnceWith(targetAddr, targetMethodJsonDescription, targetParams));
  t.true(wrapperStub.performTransactionPath.calledOnceWith(mockPath, {
    external: true
  }));
});
(0, _ava.default)('should return an observable from the contract events', async t => {
  const {
    external
  } = t.context;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {};

  const eventsStub = _sinon.default.stub().returns(eventEmitter);

  const contract = {
    events: {
      allEvents: eventsStub
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 'allEvents', {
      fromBlock: 8
    }]
  }; // act

  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(eventsStub.calledOnceWith({
    fromBlock: 8
  }));
  events.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
  eventEmitter.emit('data', {
    event: 'pay_fee',
    amount: 5
  });
});
(0, _ava.default)("should default fetching contract events from app's initialization block", async t => {
  const {
    external
  } = t.context;
  const initBlock = 10;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {
    initializationBlock: initBlock
  };

  const eventsStub = _sinon.default.stub().returns(eventEmitter);

  const contract = {
    events: {
      allEvents: eventsStub
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 'allEvents', {}]
  }; // act

  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(eventsStub.calledOnceWith({
    fromBlock: initBlock
  }));
  events.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
  eventEmitter.emit('data', {
    event: 'pay_fee',
    amount: 5
  });
});
(0, _ava.default)('should handle events for aragonAPIv1', async t => {
  const {
    external
  } = t.context;
  const fromBlock = 10;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {};

  const eventsStub = _sinon.default.stub().returns(eventEmitter);

  const contract = {
    events: {
      allEvents: eventsStub
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  }; // aragonAPIv1 only passes the fromBlock

  const requestStub = {
    params: ['addr', 'ji', fromBlock]
  }; // act

  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(eventsStub.calledOnceWith({
    fromBlock
  }));
  events.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
  eventEmitter.emit('data', {
    event: 'pay_fee',
    amount: 5
  });
});
(0, _ava.default)('should handle events without fromBlock for aragonAPIv1', async t => {
  const {
    external
  } = t.context;
  const initBlock = 10;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {
    initializationBlock: initBlock
  };

  const eventsStub = _sinon.default.stub().returns(eventEmitter);

  const contract = {
    events: {
      allEvents: eventsStub
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  }; // aragonAPIv1 does not need to pass the fromBlock

  const requestStub = {
    params: ['addr', 'ji']
  }; // act

  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(eventsStub.calledOnceWith({
    fromBlock: initBlock
  }));
  events.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
  eventEmitter.emit('data', {
    event: 'pay_fee',
    amount: 5
  });
});
(0, _ava.default)("should return an observable from the contract's past events", async t => {
  const {
    external
  } = t.context;
  t.plan(2); // arrange

  const proxy = {};
  const contract = {
    getPastEvents: _sinon.default.stub().returns([{
      event: 'pay_fee',
      amount: 5
    }])
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().withArgs('addr', 'ji').returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 'allEvents', {
      fromBlock: 8
    }]
  }; // act

  const result = external.pastEvents(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(contract.getPastEvents.calledOnceWith('allEvents', {
    fromBlock: 8
  }));
  result.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
});
(0, _ava.default)("should default fetching past events starting from app's initialization block", async t => {
  const {
    external
  } = t.context;
  const initBlock = 10;
  t.plan(2); // arrange

  const proxy = {
    initializationBlock: initBlock
  };
  const contract = {
    getPastEvents: _sinon.default.stub().returns([{
      event: 'pay_fee',
      amount: 5
    }])
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().withArgs('addr', 'ji').returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 'allEvents', {}]
  }; // act

  const result = external.pastEvents(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(contract.getPastEvents.calledOnceWith('allEvents', {
    fromBlock: initBlock
  }));
  result.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
});
(0, _ava.default)('should handle past events for aragonAPIv1', async t => {
  const {
    external
  } = t.context;
  const initBlock = 10;
  const toBlock = 18;
  t.plan(2); // arrange

  const proxy = {
    initializationBlock: initBlock
  };
  const contract = {
    getPastEvents: _sinon.default.stub().returns([{
      event: 'pay_fee',
      amount: 5
    }])
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().withArgs('addr', 'ji').returns(contract)
    }
  }; // aragonAPIv1 only passes the event options

  const requestStub = {
    params: ['addr', 'ji', {
      toBlock
    }]
  }; // act

  const result = external.pastEvents(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  t.true(contract.getPastEvents.calledOnceWith('allEvents', {
    fromBlock: initBlock,
    toBlock
  }));
  result.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    });
  });
});
(0, _ava.default)('should not apply a delay to events if not configured', async t => {
  const {
    external,
    configurationStub
  } = t.context;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {};
  const contract = {
    events: {
      'allEvents': _sinon.default.stub().returns(eventEmitter)
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 8]
  }; // act
  // Set a delay

  configurationStub.getConfiguration.withArgs(configurationKeys.SUBSCRIPTION_EVENT_DELAY).returns(0);
  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert

  const startTime = Date.now();
  events.subscribe(value => {
    t.deepEqual(value, {
      event: 'pay_fee',
      amount: 5
    }); // Hard to say exactly how much time this will take, but 20ms seems safe
    // (this should be immediate)

    t.true(Date.now() - startTime < 20);
  });
  eventEmitter.emit('data', {
    event: 'pay_fee',
    amount: 5
  });
});
(0, _ava.default)('should apply a delay to events if configured', async t => {
  const {
    external,
    configurationStub
  } = t.context;
  const delayTime = 1000;
  t.plan(2); // arrange

  const eventEmitter = new _events.EventEmitter();
  const proxy = {};
  const contract = {
    events: {
      'allEvents': _sinon.default.stub().returns(eventEmitter)
    }
  };
  const web3Stub = {
    eth: {
      Contract: _sinon.default.stub().returns(contract)
    }
  };
  const requestStub = {
    params: ['addr', 'ji', 8]
  }; // act
  // Set a delay

  configurationStub.getConfiguration.withArgs(configurationKeys.SUBSCRIPTION_EVENT_DELAY).returns(delayTime);
  const events = external.events(requestStub, proxy, {
    web3: web3Stub
  }); // assert
  // Since we've added the delay, we need to tell ava to wait until we're done subscribing

  return new Promise(resolve => {
    const startTime = Date.now();
    events.subscribe(value => {
      t.deepEqual(value, {
        event: 'pay_fee',
        amount: 5
      });
      t.true(Date.now() - startTime > delayTime);
      resolve();
    });
    eventEmitter.emit('data', {
      event: 'pay_fee',
      amount: 5
    });
  });
});
//# sourceMappingURL=external.test.js.map