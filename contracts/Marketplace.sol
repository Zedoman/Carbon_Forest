// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarbonForestToken.sol";
import "./CarbonStablecoin.sol";

contract Marketplace is Ownable {
    CarbonForestToken public forestToken;
    CarbonStablecoin public stablecoin;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price; // Price in stablecoin
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingFee = 0.015 ether; // 1.5% fee

    event TokenListed(uint256 tokenId, address seller, uint256 price);
    event TokenSold(uint256 tokenId, address buyer, uint256 price);

    constructor(address _forestToken, address _stablecoin, address initialOwner) Ownable(initialOwner) {
        forestToken = CarbonForestToken(_forestToken);
        stablecoin = CarbonStablecoin(_stablecoin);
    }

    // List a forest token for sale
    function listToken(uint256 tokenId, uint256 price) external {
        require(forestToken.balanceOf(msg.sender) >= tokenId, "Not enough tokens");
        require(forestToken.allowance(msg.sender, address(this)) >= tokenId, "Allowance not set");

        listings[tokenId] = Listing(tokenId, msg.sender, price, true);
        emit TokenListed(tokenId, msg.sender, price);
    }

    // Buy a listed forest token
    function buyToken(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Listing not active");

        uint256 fee = (listing.price * listingFee) / 1e18;
        uint256 amountAfterFee = listing.price - fee;

        stablecoin.transferFrom(msg.sender, listing.seller, amountAfterFee);
        stablecoin.transferFrom(msg.sender, owner(), fee);
        forestToken.transferFrom(listing.seller, msg.sender, tokenId);

        listings[tokenId].active = false;
        emit TokenSold(tokenId, msg.sender, listing.price);
    }

    // Update listing fee
    function updateListingFee(uint256 newFee) external onlyOwner {
        listingFee = newFee;
    }
}