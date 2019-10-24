"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doIntentPathsMatch = doIntentPathsMatch;
exports.filterAndDecodeAppUpgradeIntents = filterAndDecodeAppUpgradeIntents;

var _kernel = require("../core/aragonOS/kernel");

function doIntentPathsMatch(intentPaths) {
  const individualPaths = intentPaths // Map each path to just be an array of destination addresses
  .map(path => path.map(({
    to
  }) => to)) // Take each array of destination addresses and create a single string
  .map(path => path.join('.')); // Check if they all match by seeing if a unique set of the individual path
  // strings is a single path
  // Also make sure that there was indeed an actual path found

  return new Set(individualPaths).size === 1 && individualPaths[0];
}

async function filterAndDecodeAppUpgradeIntents(intents, wrapper) {
  const kernelApp = await wrapper.getApp(wrapper.kernelProxy.address);
  return intents // Filter for setApp() calls to the kernel
  .filter(intent => (0, _kernel.isKernelSetAppIntent)(kernelApp, intent)) // Try to decode setApp() params
  .map(intent => {
    try {
      return (0, _kernel.decodeKernelSetAppParameters)(intent.data);
    } catch (_) {}

    return {};
  }) // Filter for changes to APP_BASES_NAMESPACE
  .filter(({
    namespace
  }) => (0, _kernel.isKernelAppCodeNamespace)(namespace));
}
//# sourceMappingURL=intents.js.map