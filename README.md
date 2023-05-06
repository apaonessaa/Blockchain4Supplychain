# supplychain-blockchain
This is a project is focused on development and analysis of a supply chain system based on the use of blockchain technology.

An example scheme of the simulated supply chain for the exchange of assets is shown below.

<img width="1285" alt="Screenshot 2023-05-01 alle 16 42 53" src="https://user-images.githubusercontent.com/132266601/235469833-40969623-cf0f-450f-ab5b-55d662acffea.png">

Two different warehouses interact for the exchange of assets that the carriers will have to take delivery of and transport from one point of the supply chain to another.

Specifically, the interactions concern:

1. WarehouseA register an asset
2. WarehouseA makes an asset available for sale
3. WarehouseB orders an asset by acquiring the rights and paying the owner in ETH
4. Carrier takes delivery of the assets to be shipped
5. Carrier marks the asset as delivered 

IoT sensors positioned along the supply chain detect and modify the temperature and GPS position of the assets mobilized in the supply chain.

The system includes mechanisms capable of automating the inventory level of warehouses and carriers and the transfer of ownership and custody of goods between different players.

An asset is characterized by the following properties:

- id: represents the identifier of the product in the supply chain and is of type string;
- volume: represents the volume occupied by the asset and is an attribute linked to the warehouse and carrier inventory level;
- temperatures: attribute in which the last temperature value detected is stored. It is a necessary attribute for goods whose intrinsic value depends on the state of conservation of the product along the supply chain;
- position: attribute in which the last GPS position in which the asset was detected is stored;
- price: represents the value in ETH of the asset set by the owner of the asset;
- state: attribute that identifies the point where the asset is located in the supply chain;
- keeper: the actor who owns the physical asset without having legal possession of it;
- owner: the owner of the asset;

# System Software architecture

<img width="914" alt="Screenshot 2023-05-01 alle 16 29 42" src="https://user-images.githubusercontent.com/132266601/235467687-f5cb1c78-815e-471a-9047-3ee2e92484a6.png">

# How to use

1. Install npm dependencies defined in package.json file with the command 
``` 
$ npm install 
```

2. Run Ethereum testnet with the command 
```
$ npm run ganache
```

3. Deploy Supplychain smart contract with the command 
```
$ truffle migrate
```

4. Run a test 
```
$ truffle test
```
or 
```
$ truffle test --show-events 
```
to view the issued events

# Simulation

Before you run a simulation, you must to set in caliperWorkspace/networks/ganache.json the pair of public and private keys of the Ethereum address that deploy the smart contract and send the transaction in the local network.

1. Compilation of smart contracts
```
$ truffle compile 
```

2. Building ABI of the smart contract 
```
$ node scripts/build.js 
```

3. Run simulation defined in caliperWorkspace/benchmarks/config.yaml
```
$ npx caliper launch manager --caliper-workspace ./caliperWorkspace/ --caliper-benchconfig benchmarks/config.yaml --caliper-networkconfig networks/ganache.json
```





