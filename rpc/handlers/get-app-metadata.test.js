"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _getAppMetadata = _interopRequireDefault(require("./get-app-metadata"));

var _rxjs = require("rxjs");

(0, _ava.default)('should receive and filter the app metadata registry', async t => {
  t.plan(1);
  const getAppMetadataObservable = (0, _rxjs.from)([{
    'a': {
      from: '0x73a',
      to: ['0xdeadcafe'],
      dataId: 'u1',
      cid: 'Qmrandomhash'
    },
    'b': {
      from: '0xfed',
      to: ['0xcafe', '0xdeaddead'],
      dataId: 'u2',
      cid: 'Qmrandomhash'
    },
    'c': {
      from: '0xfed1',
      to: ['*'],
      dataId: 'u32',
      cid: 'Qmrandomhash2'
    }
  }]);
  const mockProxy = {
    address: '0xdeaddead'
  };
  const mockWrapper = {
    appMetadata: getAppMetadataObservable
  };
  (0, _getAppMetadata.default)(null, mockProxy, mockWrapper).subscribe(value => {
    t.deepEqual(value, {
      event: 'AppMetadata',
      returnValues: [{
        from: '0xfed',
        to: ['0xcafe', '0xdeaddead'],
        dataId: 'u2',
        cid: 'Qmrandomhash'
      }, {
        from: '0xfed1',
        to: ['*'],
        dataId: 'u32',
        cid: 'Qmrandomhash2'
      }]
    });
  });
});
//# sourceMappingURL=get-app-metadata.test.js.map