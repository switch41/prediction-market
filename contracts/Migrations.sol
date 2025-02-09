// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    modifier restricted() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
    
    // Add dummy function to reduce deployment cost
    function empty() public pure returns(bool) {
        return true;
    }
}