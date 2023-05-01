/** Build smart contract ABI **/

var res = require('../build/contracts/SupplyChain.json');
const abi = res["abi"];

module.exports = { abi }