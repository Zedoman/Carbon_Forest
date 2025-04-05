// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC20, Ownable {
    constructor(address initialOwner) ERC20("CarbonCredit", "CC") Ownable(initialOwner) {}

    // Mint carbon credits to a user
    function mintCredits(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Burn carbon credits (e.g., for offsetting)
    function burnCredits(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}