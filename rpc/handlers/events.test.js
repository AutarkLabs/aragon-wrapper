"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _proxyquire = _interopRequireDefault(require("proxyquire"));

var _sinon = _interopRequireDefault(require("sinon"));

var eventsUtils = _interopRequireWildcard(require("../../utils/events"));

_ava.default.beforeEach(t => {
  const utilsStub = {
    events: eventsUtils
  };
  const events = (0, _proxyquire.default)('./events', {
    '../../utils': utilsStub
  }).default;
  t.context = {
    events,
    utilsStub
  };
});

(0, _ava.default)('should invoke proxy.events with the correct options', async t => {
  const {
    events
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    events: _sinon.default.stub().returns(mockObservable)
  };
  const requestStub = {
    params: ['allEvents', {
      fromBlock: 5
    }]
  }; // act

  const eventsObservable = events(requestStub, proxyStub); // assert

  t.true(proxyStub.events.calledOnceWithExactly(['allEvents'], {
    fromBlock: 5
  }));
  t.is(eventsObservable, mockObservable);
});
(0, _ava.default)('should invoke proxy.events with the correct options for aragonAPIv1', async t => {
  const {
    events
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    events: _sinon.default.stub().returns(mockObservable)
  }; // aragonAPIv1 only passes the fromBlock

  const requestStub = {
    params: [5]
  }; // act

  const eventsObservable = events(requestStub, proxyStub); // assert

  t.true(proxyStub.events.calledOnceWith(null, {
    fromBlock: 5
  }));
  t.is(eventsObservable, mockObservable);
});
(0, _ava.default)('should invoke proxy.events with the correct options for aragonAPIv1 when no fromBlock is passed', async t => {
  const {
    events
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    events: _sinon.default.stub().returns(mockObservable)
  }; // aragonAPIv1 does not need to pass the fromBlock

  const requestStub = {
    params: []
  }; // act

  const eventsObservable = events(requestStub, proxyStub); // assert

  t.true(proxyStub.events.calledOnceWith(null, {
    fromBlock: undefined
  }));
  t.is(eventsObservable, mockObservable);
});
//# sourceMappingURL=events.test.js.map