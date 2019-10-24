"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _operators = require("rxjs/operators");

function _default(request, proxy, wrapper) {
  const [from, dataId] = request.params; // filter out data items not meant to be viewable by the caller

  const getEntry = metadataRegistry => metadataRegistry["".concat(from, ",").concat(dataId)];

  return wrapper.appMetadata.pipe( // emit observable that contains data queried
  (0, _operators.map)(metadataObject => getEntry(metadataObject)));
}
//# sourceMappingURL=query-app-metadata.js.map