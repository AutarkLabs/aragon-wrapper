"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _radspec = require("../../radspec");

async function _default(request, proxy, wrapper) {
  const [transaction = {}] = request.params;

  if (!transaction.to) {
    throw new Error("Could not describe transaction: missing 'to'");
  }

  if (!transaction.data) {
    throw new Error("Could not describe transaction: missing 'data'");
  }

  let description;

  try {
    description = await (0, _radspec.tryEvaluatingRadspec)(transaction, wrapper);
  } catch (_) {}

  if (description) {
    try {
      const processed = await (0, _radspec.postprocessRadspecDescription)(description, wrapper);
      return {
        annotatedDescription: processed.annotatedDescription,
        description: processed.description
      };
    } catch (_) {}
  }

  return {
    description
  };
}
//# sourceMappingURL=describe-transaction.js.map