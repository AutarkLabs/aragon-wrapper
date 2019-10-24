"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var apm = _interopRequireWildcard(require("./index"));

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('apm: getApmInternalAppInfo', async t => {
  t.plan(6); // arrange
  // namehash('apm-repo.aragonpm.eth')

  const repoNamehash = '0x7b4f7602faf178a4a239b8b2ed4155358e256b08ee7c6b6b1b01ebec891ce1f1'; // namehash('apm-repo.open.aragonpm.eth')

  const repoOpenNamehash = '0xf254443da20ea3d6bad4fa45ddd197dd713255675d3304106f889682e479f9c0'; // act

  const result = apm.getApmInternalAppInfo(repoNamehash);
  const openResult = apm.getApmInternalAppInfo(repoOpenNamehash);
  const emptyResult = apm.getApmInternalAppInfo(); // assert

  t.is(result.name, 'Repo');
  t.true(Array.isArray(result.abi));
  t.is(openResult.name, 'Repo');
  t.true(Array.isArray(openResult.abi));
  t.deepEqual(result, openResult);
  t.is(emptyResult, null);
});
//# sourceMappingURL=index.test.js.map