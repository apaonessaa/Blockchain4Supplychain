// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

library Roles {

    struct Role {
        mapping(address => bool) members;
        mapping(address => uint) levels;
    }

    function add(Role storage role, address account, uint inventory) internal {
        role.members[account] = true;
        role.levels[account] = inventory;
    }

    function verify(Role storage role, address account) internal view returns(bool) {
        return role.members[account];
    }

    function get(Role storage role, address account) internal view returns(uint) {
        return role.levels[account];
    }

    function busy(Role storage role, address account, uint volume) internal {
        role.levels[account] -= volume;
    }

    function free(Role storage role, address account, uint volume) internal {
        role.levels[account] += volume;
    }  
} 

abstract contract Warehouse {
    using Roles for Roles.Role;

    Roles.Role private warehouses;

    modifier onlyWarehouse {
        require(  warehouses.verify(msg.sender) );
        _;
    }

    function registerWarehouse(uint inventory) public {
        warehouses.add(msg.sender, inventory);
    }

    function storeWH(address account, uint volume) internal {
        warehouses.busy(account, volume);
    }

    function releaseWH(address account, uint volume) internal {
        warehouses.free(account, volume);
    }

    function getWH(address account) public view returns(uint) {
        return warehouses.get(account);
    }
} 

abstract contract Carrier {
    using Roles for Roles.Role;

    Roles.Role private carriers;

    modifier onlyCarrier {
        require( carriers.verify(msg.sender) );
        _;
    }

    function registerCarrier(uint inventory) public {
        carriers.add(msg.sender, inventory);
    }

    function storeCarrier(address account, uint volume) internal {
        carriers.busy(account, volume);
    }

    function releaseCarrier(address account, uint volume) internal {
        carriers.free(account, volume);
    }

    function getCarrier(address account) public view returns(uint) {
        return carriers.get(account);
    }
} 

abstract contract IoT {

    // sensor => owner
    mapping(address => address) devices;

    modifier onlyIoT {
        // require( devices[msg.sender] != address(0) );
        _;
    }

    function registerIoT(address account) public {
        devices[msg.sender] = account;
    }

    function getIoT(address account) internal view returns(address) {
        return devices[account];
    }
} 