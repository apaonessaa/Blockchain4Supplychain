var web3 = require('web3')

const price = 10;
const etherValue = web3.utils.toWei('10', 'ether')
const asset = "asset1"
const volume = 10;
const state = [ 'nostate', 'registered', 'forsale', 'ordered', 'intransit', 'delivered' ];

const SupplyChain = artifacts.require("SupplyChain")

contract("SupplyChain"+"\n", (accounts) => {
  it("Simulate", async () => {
    const contract = await SupplyChain.deployed()

    const WHA = accounts[0]
    const WHB = accounts[1]
    const carrier = accounts[2]
    const sensor = accounts[3]

    let array = [];

    /**** Register ****/ 

    await contract.registerWarehouse(100,{from:WHA}).then((txData)=>{ array[0]= txData.receipt.gasUsed })
    await contract.registerWarehouse(100,{from:WHB})
    await contract.registerCarrier(100,{from:carrier})
    await contract.registerIoT(carrier,{from:carrier})

    console.log(
      await contract.getWH(WHA).then(
        (tupla) => {
          return JSON.stringify({
            warehouseA: WHA,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getWH(WHB).then(
        (tupla) => {
          return JSON.stringify({
            warehouseB: WHB,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getCarrier(carrier).then(
        (tupla) => {
          return JSON.stringify({
            carrier: carrier,
            sensor: sensor,
            inventory: tupla.toNumber()
            }, null, 2)}))

    /**** Create asset ****/ 

    await contract.create(asset, volume, {from:WHA}).then((txData)=>{ array[1]= txData.receipt.gasUsed })

    await contract.forsale(asset, price, {from:WHA}).then((txData)=>{ array[2]= txData.receipt.gasUsed })

    console.log(
      await contract.getWH(WHA).then(
        (tupla) => {
          return JSON.stringify({
            warehouseA: WHA,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getAsset(asset).then(
        (tupla) => {
          return JSON.stringify({
            id: asset,
            volume: tupla[0],
            temperature: tupla[1],
            position: tupla[2],
            price: tupla[3],
            state: state[ tupla[4] ],
            owner: tupla[5],
            keeper: tupla[6]
            }, null, 2)}))

    /**** Order, take and track asset ****/ 

    await contract.order(asset, {from:WHB, value:etherValue}).then((txData)=>{ array[3]= txData.receipt.gasUsed })
  
    await contract.take(asset, {from:carrier}).then((txData)=>{ array[4]= txData.receipt.gasUsed })

    var temp = Math.floor(Math.random()*100).toString()
    var position = (Math.random()*100).toString().concat(", ", (Math.random()*100).toString())

    await contract.track(asset, temp, position, {from:sensor}).then((txData)=>{ array[5]= txData.receipt.gasUsed })

    console.log(
      await contract.getWH(WHA).then(
        (tupla) => {
          return JSON.stringify({
            warehouseA: WHA,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getCarrier(carrier).then(
        (tupla) => {
          return JSON.stringify({
            carrier: carrier,
            sensor: sensor,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getAsset(asset).then(
        (tupla) => {
          return JSON.stringify({
            id: asset,
            volume: tupla[0],
            temperature: tupla[1],
            position: tupla[2],
            price: tupla[3],
            state: state[ tupla[4] ],
            owner: tupla[5],
            keeper: tupla[6]
            }, null, 2)}))

    /**** Delivered asset ****/ 

    await contract.delivered(asset, {from:carrier}).then((txData)=>{ array[6]= txData.receipt.gasUsed })

    console.log(
      await contract.getWH(WHB).then(
        (tupla) => {
          return JSON.stringify({
            warehouseB: WHB,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getCarrier(carrier).then(
        (tupla) => {
          return JSON.stringify({
            carrier: carrier,
            sensor: sensor,
            inventory: tupla.toNumber()
            }, null, 2)}))

    console.log(
      await contract.getAsset(asset).then(
        (tupla) => {
          return JSON.stringify({
            id: asset,
            volume: tupla[0],
            temperature: tupla[1],
            position: tupla[2],
            price: tupla[3],
            state: state[ tupla[4] ],
            owner: tupla[5],
            keeper: tupla[6]
            }, null, 2)}))

    console.log("Gas used:",
      JSON.stringify({
        register: array[0],
        create: array[1],
        forsale: array[2],
        order: array[3],
        take: array[4],
        track: array[5],
        delivered: array[6]
        }, null, 2)
    )

  });
});
