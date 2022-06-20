// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address owner;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function can only be called by the contract owner"
        );
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function setNewOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function mint(uint256 _supply) external onlyOwner {
        _mint(msg.sender, _supply);
    }

    function burn(address _account, uint256 _supply) external onlyOwner {
        _burn(_account, _supply);
    }
}
