"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPretransaction = applyPretransaction;
exports.applyForwardingPretransaction = applyForwardingPretransaction;
exports.createDirectTransaction = createDirectTransaction;
exports.createDirectTransactionForApp = createDirectTransactionForApp;
exports.createForwarderTransactionBuilder = createForwarderTransactionBuilder;
exports.getRecommendedGasLimit = getRecommendedGasLimit;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _web3Utils = require("web3-utils");

var _interfaces = require("../interfaces");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const DEFAULT_GAS_FUZZ_FACTOR = 1.5;
const PREVIOUS_BLOCK_GAS_LIMIT_FACTOR = 0.95;

async function applyPretransaction(directTransaction, web3) {
  // Token allowance pretransaction
  if (directTransaction.token) {
    const {
      from,
      to,
      token: {
        address: tokenAddress,
        value: tokenValue,
        spender
      }
    } = directTransaction; // Approve the transaction destination unless an spender is passed to approve a different contract

    const approveSpender = spender || to;
    const erc20ABI = (0, _interfaces.getAbi)('standard/ERC20');
    const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
    const balance = await tokenContract.methods.balanceOf(from).call();
    const tokenValueBN = (0, _web3Utils.toBN)(tokenValue);

    if ((0, _web3Utils.toBN)(balance).lt(tokenValueBN)) {
      throw new Error("Balance too low. ".concat(from, " balance of ").concat(tokenAddress, " token is ").concat(balance, " (attempting to send ").concat(tokenValue, ")"));
    }

    const allowance = await tokenContract.methods.allowance(from, approveSpender).call();
    const allowanceBN = (0, _web3Utils.toBN)(allowance); // If allowance is already greater than or equal to amount, there is no need to do an approve transaction

    if (allowanceBN.lt(tokenValueBN)) {
      if (allowanceBN.gt((0, _web3Utils.toBN)(0))) {
        // TODO: Actually handle existing approvals (some tokens fail when the current allowance is not 0)
        console.warn("".concat(from, " already approved ").concat(approveSpender, ". In some tokens, approval will fail unless the allowance is reset to 0 before re-approving again."));
      }

      const tokenApproveTransaction = {
        // TODO: should we include transaction options?
        from,
        to: tokenAddress,
        data: tokenContract.methods.approve(approveSpender, tokenValue).encodeABI()
      };
      directTransaction.pretransaction = tokenApproveTransaction;
      delete directTransaction.token;
    }
  }

  return directTransaction;
}

async function applyForwardingPretransaction(forwardingTransaction, web3) {
  const {
    to: forwarder
  } = forwardingTransaction; // Check if a token approval pretransaction is needed due to the forwarder requiring a fee

  const forwardFee = new web3.eth.Contract((0, _interfaces.getAbi)('aragon/ForwarderFee'), forwarder).methods['forwardFee'];
  const feeDetails = {
    amount: (0, _web3Utils.toBN)(0)
  };

  try {
    const feeResult = await forwardFee().call(); // forwardFee() returns (address, uint256)

    feeDetails.tokenAddress = feeResult[0];
    feeDetails.amount = (0, _web3Utils.toBN)(feeResult[1]);
  } catch (err) {// Not all forwarders implement the `forwardFee()` interface
  }

  if (feeDetails.tokenAddress && feeDetails.amount.gt((0, _web3Utils.toBN)(0))) {
    // Needs a token approval pretransaction
    forwardingTransaction.token = {
      address: feeDetails.tokenAddress,
      spender: forwarder,
      // since it's a forwarding transaction, always show the real spender
      value: feeDetails.amount.toString()
    };
  }

  return applyPretransaction(forwardingTransaction, web3);
}

async function createDirectTransaction(sender, destination, methodJsonDescription, params, web3) {
  let transactionOptions = {}; // If an extra parameter has been provided, it is the transaction options if it is an object

  if (methodJsonDescription.inputs.length + 1 === params.length && typeof params[params.length - 1] === 'object') {
    const options = params.pop();
    transactionOptions = _objectSpread({}, transactionOptions, {}, options);
  } // The direct transaction we eventually want to perform


  const directTransaction = _objectSpread({}, transactionOptions, {
    // Options are overwriten by the values below
    from: sender,
    to: destination,
    data: web3.eth.abi.encodeFunctionCall(methodJsonDescription, params)
  }); // Add any pretransactions specified


  return applyPretransaction(directTransaction, web3);
}

async function createDirectTransactionForApp(sender, app, methodName, params, web3) {
  if (!app) {
    throw new Error("Could not create transaction due to missing app artifact");
  }

  const {
    proxyAddress: destination
  } = app;

  if (!app.abi) {
    throw new Error("No ABI specified in artifact for ".concat(destination));
  }

  const methodJsonDescription = app.abi.find(method => method.name === methodName);

  if (!methodJsonDescription) {
    throw new Error("".concat(methodName, " not found on ABI for ").concat(destination));
  }

  return createDirectTransaction(sender, destination, methodJsonDescription, params, web3);
}

function createForwarderTransactionBuilder(sender, directTransaction, web3) {
  const forwardMethod = new web3.eth.Contract((0, _interfaces.getAbi)('aragon/Forwarder')).methods['forward'];
  return (forwarderAddress, script) => _objectSpread({}, directTransaction, {
    // Options are overwriten by the values below
    from: sender,
    to: forwarderAddress,
    data: forwardMethod(script).encodeABI()
  });
}

async function getRecommendedGasLimit(web3, estimatedGasLimit, {
  gasFuzzFactor = DEFAULT_GAS_FUZZ_FACTOR
} = {}) {
  const latestBlock = await web3.eth.getBlock('latest');
  const latestBlockGasLimit = latestBlock.gasLimit;
  const upperGasLimit = Math.round(latestBlockGasLimit * PREVIOUS_BLOCK_GAS_LIMIT_FACTOR);
  const bufferedGasLimit = Math.round(estimatedGasLimit * gasFuzzFactor);

  if (estimatedGasLimit > upperGasLimit) {
    // TODO: Consider whether we should throw an error rather than returning with a high gas limit
    return estimatedGasLimit;
  } else if (bufferedGasLimit < upperGasLimit) {
    return bufferedGasLimit;
  } else {
    return upperGasLimit;
  }
}
//# sourceMappingURL=transactions.js.map