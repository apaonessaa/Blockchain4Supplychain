// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

enum State { nostate, registered, forsale, ordered, intransit, delivered }

abstract contract AbstractAsset {
    
    mapping(string => Asset) assets;
    
    struct Asset {
        uint volume;
        string temperature;
        string position;
        uint price;
        State state;
        address owner;
        address keeper;
    }

    event ReportState(string id, State state);
    event TransferOwner(string id, address from, address to);
    event TransferKeeper(string id, address from, address to);
    event Track(string id, State state, string temperature, string position, address sensor, uint timestamp);

    modifier onlyOwner(string memory id) {
        require(assets[id].owner == msg.sender);
        _;
    }

    modifier onlyKeeper(string memory id) {
        require(assets[id].keeper == msg.sender);
        _;
    }

    modifier isEnough(uint price) {
        require(msg.value / 1 ether >= price);
        _;
    }  

    function setState(string memory id, State state) internal {
        emit ReportState(id,state);
        assets[id].state = state;
    }

    function setOwner(string memory id, address owner) internal {
        emit TransferOwner(id, assets[id].owner, owner);
        assets[id].owner = owner;
    }

    function setKeeper(string memory id, address keeper) internal {
        emit TransferKeeper(id, assets[id].keeper, keeper);
        assets[id].keeper = keeper;
    }

    function setValue(string memory id, string memory temp, string memory position, address sensor) internal {
        emit Track(id, assets[id].state, temp, position, sensor, block.timestamp);
        assets[id].temperature = temp;
        assets[id].position = position;
    }

    function getAsset(string memory id) external view returns(Asset memory) {
        return assets[id];
    }

}


