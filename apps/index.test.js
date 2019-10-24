"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _index = _interopRequireDefault(require("./index"));

(0, _ava.default)('AppContextPool starts empty', async t => {
  // arrange
  const appAddress = '0x12'; // act

  const pool = new _index.default(); // assert

  t.false(pool.hasApp(appAddress));
});
(0, _ava.default)('AppContextPool can create new app contexts', async t => {
  // arrange
  const appAddress = '0x12'; // act

  const pool = new _index.default();
  pool.set(appAddress, 'path', '/vote'); // assert

  t.true(pool.hasApp(appAddress));
});
(0, _ava.default)('AppContextPool can read and write values to app context', async t => {
  // arrange
  const appAddress = '0x12'; // act

  const pool = new _index.default();
  pool.set(appAddress, 'first', 'first value');
  pool.set(appAddress, 'second', 'first value');
  pool.set(appAddress, 'second', 'second value'); // assert

  t.is((await pool.get(appAddress, 'first')), 'first value');
  t.is((await pool.get(appAddress, 'second')), 'second value');
});
(0, _ava.default)('AppContextPool can observe values from app context', async t => {
  // arrange
  const appAddress = '0x12';
  const contextKey = 'key'; // act

  const pool = new _index.default();
  const observedContext = pool.observe(appAddress, contextKey);
  pool.set(appAddress, contextKey, 'first value'); // starting value
  // assert

  let counter = 0;
  observedContext.subscribe(val => {
    if (counter === 0) {
      t.is(val, 'first value');
    } else if (counter === 1) {
      t.is(val, 'second value');
    } else if (counter === 2) {
      t.is(val, 'third value');
    } else {
      t.fail('too many emissions');
    }

    counter++;
  }); // Emit after subscribed

  pool.set(appAddress, contextKey, 'second value');
  pool.set(appAddress, contextKey, 'third value');
});
//# sourceMappingURL=index.test.js.map