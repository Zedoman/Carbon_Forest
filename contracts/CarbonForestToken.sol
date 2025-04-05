// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonForestToken is ERC20, Ownable {
    mapping(uint256 => string) public parcelMetadata; // Maps token ID to metadata (e.g., IPFS hash)
    mapping(uint256 => uint256) public carbonYield;   // Carbon yield per parcel (in tons/year)

    constructor(address initialOwner) ERC20("CarbonForestToken", "CFT") Ownable(initialOwner) {}

    // Mint new tokens for a forest parcel
    function mintParcel(address to, uint256 tokenId, string memory metadata, uint256 yieldAmount) external onlyOwner {
        _mint(to, tokenId);
        parcelMetadata[tokenId] = metadata;
        carbonYield[tokenId] = yieldAmount;
    }

    // Update carbon yield for a parcel
    function updateCarbonYield(uint256 tokenId, uint256 newYield) external onlyOwner {
        carbonYield[tokenId] = newYield;
    }
}