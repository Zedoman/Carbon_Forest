// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarbonCredit.sol";

contract CarbonStablecoin is ERC20, Ownable {
    CarbonCredit public carbonCredit;
    uint256 public pegValue; // Value of 1 stablecoin in carbon credits (e.g., 1 stablecoin = 1 CC)

    constructor(address _carbonCredit, address initialOwner) ERC20("CarbonStablecoin", "CFS") Ownable(initialOwner) {
        carbonCredit = CarbonCredit(_carbonCredit);
        pegValue = 1e18; // 1 stablecoin = 1 carbon credit (adjustable)
    }

    // Mint stablecoins by locking carbon credits
    function mint(address to, uint256 amount) external {
        uint256 requiredCredits = (amount * pegValue) / 1e18;
        carbonCredit.transferFrom(msg.sender, address(this), requiredCredits);
        _mint(to, amount);
    }

    // Burn stablecoins to redeem carbon credits
    function redeem(address from, uint256 amount) external {
        uint256 creditsToRelease = (amount * pegValue) / 1e18;
        _burn(from, amount);
        carbonCredit.transfer(from, creditsToRelease);
    }

    // Update peg value (e.g., if carbon credit market price changes)
    function updatePegValue(uint256 newPegValue) external onlyOwner {
        pegValue = newPegValue;
    }
}