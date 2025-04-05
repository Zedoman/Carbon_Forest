import pkg from "hardhat";
import { readFile } from "fs/promises";

const { ethers } = pkg;

async function main() {
  // Read the contract addresses dynamically
  let contractAddresses;
  try {
    contractAddresses = JSON.parse(
      await readFile(new URL("./contract-addresses.json", import.meta.url), "utf8")
    );
  } catch (error) {
    throw new Error("Failed to read contract-addresses.json. Please deploy your contracts first using scripts/deploy.js.");
  }

  // Check if CarbonForestToken address exists
  if (!contractAddresses.CarbonForestToken) {
    throw new Error("CarbonForestToken address not found in contract-addresses.json. Please deploy your contracts first.");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("CarbonForestToken address:", contractAddresses.CarbonForestToken);

  // Debug: Check if a contract exists at the address
  const provider = ethers.provider;
  const bytecode = await provider.getCode(contractAddresses.CarbonForestToken);
  if (bytecode === "0x") {
    throw new Error("No contract found at the CarbonForestToken address. Please redeploy your contracts.");
  }
  console.log("Bytecode at address:", bytecode);

  const CarbonForestToken = await ethers.getContractAt(
    "CarbonForestToken",
    contractAddresses.CarbonForestToken,
    deployer
  );

  // Debug: Check if the mintParcel function exists
  if (typeof CarbonForestToken.mintParcel !== "function") {
    console.error("The 'mintParcel' function does not exist on the CarbonForestToken contract.");
    console.log("Available functions:", Object.keys(CarbonForestToken));
    throw new Error("mintParcel function not found. Please check the contract implementation.");
  }

  // Debug: Check the owner of the contract
  try {
    const owner = await CarbonForestToken.owner();
    console.log("Contract owner:", owner);
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.warn("Deployer is not the owner of the contract. Minting may fail due to access control.");
    }
  } catch (error) {
    console.error("Failed to fetch contract owner:", error.message);
    throw new Error("Could not verify contract owner. The contract at the address may not be a valid CarbonForestToken contract.");
  }

  // Mint some tokens using mintParcel
  const tx1 = await CarbonForestToken.mintParcel(
    deployer.address, // address to
    ethers.parseEther("1000"), // tokenId (amount to mint in wei, e.g., 1000 tokens)
    "ipfs://amazon-parcel-a", // metadata (e.g., IPFS hash for Amazon Rainforest Parcel A)
    25 // yieldAmount (carbon yield in tons/year)
  );
  await tx1.wait();
  console.log("Minted parcel 1");

  const tx2 = await CarbonForestToken.mintParcel(
    deployer.address, // address to
    ethers.parseEther("800"), // tokenId (amount to mint in wei, e.g., 800 tokens)
    "ipfs://borneo-parcel-b", // metadata (e.g., IPFS hash for Borneo Mangrove Reserve)
    18 // yieldAmount (carbon yield in tons/year)
  );
  await tx2.wait();
  console.log("Minted parcel 2");

  console.log("Tokens minted successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});