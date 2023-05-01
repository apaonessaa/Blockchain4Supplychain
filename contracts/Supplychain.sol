// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "./Actors.sol";
import "./Asset.sol";

contract SupplyChain is AbstractAsset, Warehouse, Carrier, IoT {

    constructor() {
        /*  Register for run simulation with caliper
            else use comment */

        registerWarehouse(100);
        registerCarrier(100);
        registerIoT(msg.sender);
    }

    modifier entry(string memory id, State state) {
        /*  Comment for run similation with caliper
            else remove comment */

        // require(assets[id].state == state);
        _;
    }

    modifier entry2(string memory id, State state1, State state2) {
        /*  Comment for run similation with caliper
            else remove comment */

        // require(assets[id].state == state1 || assets[id].state == state2);
        _;
    }
    
    function create(string memory id, uint volume) external onlyWarehouse entry(id, State.nostate) onlyWarehouse {
        require(getWH(msg.sender) > volume);

        storeWH(msg.sender, volume);
        setState(id, State.registered);
        setOwner(id, msg.sender);
        setKeeper(id, msg.sender);

        assets[id].volume = volume;
    }

    function forsale(string memory id, uint price) external entry2(id, State.registered, State.delivered) onlyOwner(id) onlyKeeper(id) onlyWarehouse {
        setState(id, State.forsale);
        assets[id].price = price;
    }

    function order(string memory id) external payable entry(id, State.forsale) isEnough(assets[id].price) onlyWarehouse {
        require(getWH(msg.sender) > assets[id].volume);

        storeWH(msg.sender, assets[id].volume);

        (bool success,) = assets[id].owner.call{value: msg.value}("");
        require(success);

        setState(id, State.ordered);
        setOwner(id, msg.sender);
    }

    function take(string memory id) external entry(id, State.ordered) onlyCarrier {
        require(getCarrier(msg.sender) > assets[id].volume);

        storeCarrier(msg.sender, assets[id].volume);
        releaseWH(assets[id].keeper, assets[id].volume);
        setState(id, State.intransit);
        setKeeper(id, msg.sender);
    }

    function delivered(string memory id) external entry(id, State.intransit) onlyKeeper(id) onlyCarrier {
        releaseCarrier(msg.sender, assets[id].volume);
        setState(id, State.delivered);
        setKeeper(id, assets[id].owner);
    }

    function track(string memory id, string memory temp, string memory position) external onlyIoT {
        setValue(id, temp, position, msg.sender);
    }
}

