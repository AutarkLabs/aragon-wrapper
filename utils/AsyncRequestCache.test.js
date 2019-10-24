"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var _AsyncRequestCache = _interopRequireDefault(require("./AsyncRequestCache"));

const wait = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

(0, _ava.default)('AsyncRequestCache should cache requests', async t => {
  // arrange
  const requestKey = 'key';

  const requestFn = _sinon.default.spy(async key => {
    await wait(100);
    return key;
  });

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const request = cache.request(requestKey);
  const result = await request;
  const requestAgain = cache.request(requestKey);
  const resultAgain = await requestAgain; // assert

  t.is(request, requestAgain);
  t.is(result, resultAgain);
  t.true(cache.has(requestKey));
  t.true(requestFn.calledOnceWith(requestKey));
});
(0, _ava.default)('AsyncRequestCache can cache more than one key', async t => {
  // arrange
  const firstKey = 'first';
  const secondKey = 'second';

  const requestFn = _sinon.default.spy(async key => {
    await wait(100);
    return key;
  });

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const requestFirst = cache.request(firstKey);
  const requestSecond = cache.request(secondKey);
  const resultFirst = await requestFirst;
  const resultSecond = await requestSecond; // Once first two requests have settled, re-request keys

  const resultFirstAgain = await cache.request(firstKey);
  const resultSecondAgain = await cache.request(secondKey); // assert

  t.true(cache.has(firstKey));
  t.true(cache.has(secondKey));
  t.is(resultFirst, resultFirstAgain);
  t.is(resultSecond, resultSecondAgain);
  t.not(resultFirst, resultSecond);
  t.is(requestFn.callCount, 2);
});
(0, _ava.default)('AsyncRequestCache should be able to force invalidate requests', async t => {
  // arrange
  const requestKey = 'key';

  const requestFn = _sinon.default.spy(async key => {
    await wait(100);
    return key;
  });

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const request = cache.request(requestKey);
  await request;
  const requestInvalidate = cache.request(requestKey, true);
  await requestInvalidate; // assert

  t.not(request, requestInvalidate);
  t.true(cache.has(requestKey));
  t.is(requestFn.callCount, 2);
});
(0, _ava.default)('AsyncRequestCache does not cache result if unsuccessful', async t => {
  // arrange
  const requestKey = 'key';

  const requestFn = _sinon.default.spy(async key => {
    await wait(100);
    throw new Error('error');
  });

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const requestFail = await t.throwsAsync(cache.request(requestKey)); // assert

  t.is(requestFail.message, 'error');
  t.false(cache.has(requestKey));
});
(0, _ava.default)('AsyncRequestCache deduplicates in-flight requests', async t => {
  // arrange
  const requestKey = 'key';

  const requestFn = _sinon.default.spy(async key => {
    await wait(100);

    if (requestFn.callCount === 1) {
      throw new Error('error');
    }

    return key;
  });

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const requestFail = cache.request(requestKey);
  const requestFailAgain = cache.request(requestKey);
  const resultFail = await t.throwsAsync(requestFail);
  const resultFailAgain = await t.throwsAsync(requestFailAgain);
  const requestSuccess = cache.request(requestKey);
  const requestSuccessAgain = cache.request(requestKey);
  const resultSuccess = await requestSuccess;
  const resultSuccessAgain = await requestSuccessAgain; // assert

  t.is(requestFail, requestFailAgain);
  t.is(resultFail, resultFailAgain);
  t.not(requestFail, requestSuccess);
  t.is(requestSuccess, requestSuccessAgain);
  t.is(resultSuccess, resultSuccessAgain);
  t.true(cache.has(requestKey));
  t.is(requestFn.callCount, 2);
});
(0, _ava.default)('AsyncRequestCache should work with non-async request functions', async t => {
  // arrange
  const requestKey = 'key';

  const requestFn = _sinon.default.spy(key => key);

  const cache = new _AsyncRequestCache.default(requestFn); // act

  const request = cache.request(requestKey);
  const result = await request;
  const requestAgain = cache.request(requestKey);
  const resultAgain = await requestAgain; // assert

  t.is(request, requestAgain);
  t.is(result, resultAgain);
  t.true(cache.has(requestKey));
  t.true(requestFn.calledOnceWith(requestKey));
});
//# sourceMappingURL=AsyncRequestCache.test.js.map