// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address owner;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function setNewOwner(address _newOwner) public {
        require(
            owner == msg.sender,
            "This function can only be called by the contract owner"
        );
        owner = _newOwner;
    }
}
