"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _operators = require("rxjs/operators");

function _default(request, proxy, wrapper) {
  // filter out data items not meant to be viewable by the caller
  const getAppMetadata = metadataRegistry => Object.values(metadataRegistry).filter(action => action.to.includes('*') || action.to.includes(proxy.address));

  return wrapper.appMetadata.pipe( // transform the observable into an event-like object
  // that only contains data for selected target applications
  (0, _operators.map)(appMetadataObject => ({
    event: 'AppMetadata',
    returnValues: getAppMetadata(appMetadataObject)
  })), // only emit observables that contain data
  (0, _operators.filter)(metadataEvent => metadataEvent.returnValues.length > 0));
}
//# sourceMappingURL=get-app-metadata.js.map