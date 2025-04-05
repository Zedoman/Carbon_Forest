import pkg from "hardhat";
import { readFile } from "fs/promises";

const { ethers, network } = pkg;

async function main() {
  // Log the network being used
  console.log("Network:", network.name);

  // Read the contract addresses dynamically
  let contractAddresses;
  try {
    contractAddresses = JSON.parse(
      await readFile(new URL("./contract-addresses.json", import.meta.url), "utf8")
    );
  } catch (error) {
    throw new Error("Failed to read contract-addresses.json. Please deploy your contracts first using scripts/deploy.js.");
  }

  // Check if contract addresses exist
  if (!contractAddresses.CarbonForestToken || !contractAddresses.Marketplace) {
    throw new Error("CarbonForestToken or Marketplace address not found in contract-addresses.json. Please deploy your contracts first.");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("CarbonForestToken address:", contractAddresses.CarbonForestToken);
  console.log("Marketplace address:", contractAddresses.Marketplace);

  // Debug: Check if contracts exist at the addresses
  const provider = ethers.provider;
  const carbonForestBytecode = await provider.getCode(contractAddresses.CarbonForestToken);
  const marketplaceBytecode = await provider.getCode(contractAddresses.Marketplace);
  if (carbonForestBytecode === "0x" || marketplaceBytecode === "0x") {
    throw new Error("No contract found at the CarbonForestToken or Marketplace address. Please redeploy your contracts.");
  }
  console.log("CarbonForestToken bytecode:", carbonForestBytecode);
  console.log("Marketplace bytecode:", marketplaceBytecode);

  const CarbonForestToken = await ethers.getContractAt("CarbonForestToken", contractAddresses.CarbonForestToken, deployer);
  const Marketplace = await ethers.getContractAt("Marketplace", contractAddresses.Marketplace, deployer);

  // Placeholder for approval and listing logic
  console.log("Contracts loaded successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});