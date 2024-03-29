"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _queryAppMetadata = _interopRequireDefault(require("./query-app-metadata"));

var _rxjs = require("rxjs");

(0, _ava.default)('should receive and filter the app metadata registry', async t => {
  t.plan(2); /// should return the specific action requested
  // arrange

  const queryAppMetadataObservable = (0, _rxjs.of)({
    'a,1': {
      from: '0x73a',
      to: ['0xdeadcafe'],
      dataId: 'u1',
      cid: 'Qmrandomhash'
    },
    'a,2': {
      from: '0xfed',
      to: ['0xcafe', '0xdeaddead'],
      dataId: 'u2',
      cid: 'Qmrandomhash'
    },
    'b,1': {
      from: '0xfed1',
      to: ['*'],
      dataId: 'u32',
      cid: 'Qmrandomhash2'
    }
  });
  const mockRequest = {
    params: ['a', '2']
  };
  const mockWrapper = {
    appMetadata: queryAppMetadataObservable
  }; // act

  (0, _queryAppMetadata.default)(mockRequest, null, mockWrapper).subscribe(value => {
    // assert
    t.deepEqual(value, {
      from: '0xfed',
      to: ['0xcafe', '0xdeaddead'],
      dataId: 'u2',
      cid: 'Qmrandomhash'
    });
  }); /// should return undefined for invalid queries
  // arrange

  const mockInvalidRequest = {
    params: ['a', '3']
  }; // act

  (0, _queryAppMetadata.default)(mockInvalidRequest, null, mockWrapper).subscribe(value => {
    // assert
    t.is(value, undefined, 'query for an absent entry should return undefined');
  });
});
//# sourceMappingURL=query-app-metadata.test.js.map