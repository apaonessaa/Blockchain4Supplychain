/** Listen events from smart contract **/

const { ethers } = require("ethers")
const { abi } = require("./abi.js")

require("dotenv").config();

const network = "http://localhost:8545"
const contractAddress = "0xFE5c60B2e0226f736A0052289371Da65d081a9Fa";

async function init() {

  const provider = new ethers.providers.JsonRpcProvider(network);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  contract.on("Track", (id, state, temp, position, sensor, owner, timestamp, event) => {
    let info = {
      action: event.event,
      asset: id,
      state: state,
      temperature: temp,
      position: position,
      sensor: sensor,
      owner: owner,
      timestamp: timestamp.toNumber(),
      blockNumber: event.blockNumber,
      transactionIndex: event.transactionIndex,
      transactionHash: event.transactionHash   
    }
    console.log(JSON.stringify(info, null, 3));
  });
}

init().catch((err) => {
  console.log(err);
  process.exit(1);
});