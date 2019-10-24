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
  const pastEvents = (0, _proxyquire.default)('./past-events', {
    '../../utils': utilsStub
  }).default;
  t.context = {
    pastEvents,
    utilsStub
  };
});

(0, _ava.default)('should invoke proxy.pastEvents with the correct options', async t => {
  const {
    pastEvents
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    pastEvents: _sinon.default.stub().returns(mockObservable)
  };
  const requestStub = {
    params: ['allEvents', {
      fromBlock: 5
    }]
  }; // act

  const pastEventsObservable = pastEvents(requestStub, proxyStub); // assert

  t.true(proxyStub.pastEvents.calledOnceWithExactly(['allEvents'], {
    fromBlock: 5
  }));
  t.is(pastEventsObservable, mockObservable);
});
(0, _ava.default)('should invoke proxy.pastEvents with the correct options for aragonAPIv1', async t => {
  const {
    pastEvents
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    pastEvents: _sinon.default.stub().returns(mockObservable)
  }; // aragonAPIv1 only passes the fromBlock

  const requestStub = {
    params: [5, 10]
  }; // act

  const pastEventsObservable = pastEvents(requestStub, proxyStub); // assert

  t.true(proxyStub.pastEvents.calledOnceWith(null, {
    fromBlock: 5,
    toBlock: 10
  }));
  t.is(pastEventsObservable, mockObservable);
});
(0, _ava.default)('should invoke proxy.pastEvents with the correct options for aragonAPIv1 when no fromBlock is passed', async t => {
  const {
    pastEvents
  } = t.context;
  t.plan(2); // arrange

  const mockObservable = Symbol('mockObservable');
  const proxyStub = {
    pastEvents: _sinon.default.stub().returns(mockObservable)
  }; // aragonAPIv1 does not need to pass the fromBlock

  const requestStub = {
    params: []
  }; // act

  const pastEventsObservable = pastEvents(requestStub, proxyStub); // assert

  t.true(proxyStub.pastEvents.calledOnceWith(null, {
    fromBlock: undefined,
    toBlock: undefined
  }));
  t.is(pastEventsObservable, mockObservable);
});
//# sourceMappingURL=past-events.test.js.map