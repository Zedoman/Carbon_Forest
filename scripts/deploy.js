import hre from 'hardhat';

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);
  
    // Deploy CarbonForestToken
    const CarbonForestToken = await hre.ethers.getContractFactory('CarbonForestToken');
    const carbonForestToken = await CarbonForestToken.deploy(deployer.address);
    const forestTokenAddress = await carbonForestToken.getAddress(); // Explicitly get address
    console.log('CarbonForestToken deployed to:', forestTokenAddress);
  
    // Deploy CarbonCredit
    const CarbonCredit = await hre.ethers.getContractFactory('CarbonCredit');
    const carbonCredit = await CarbonCredit.deploy(deployer.address);
    const creditAddress = await carbonCredit.getAddress();
    console.log('CarbonCredit deployed to:', creditAddress);
  
    // Deploy CarbonStablecoin with CarbonCredit address
    const Stablecoin = await hre.ethers.getContractFactory('CarbonStablecoin');
    const stablecoin = await Stablecoin.deploy(creditAddress, deployer.address);
    const stablecoinAddress = await stablecoin.getAddress();
    console.log('CarbonStablecoin deployed to:', stablecoinAddress);
  
    // Deploy Marketplace with CarbonForestToken and CarbonStablecoin addresses
    const Marketplace = await hre.ethers.getContractFactory('Marketplace');
    const marketplace = await Marketplace.deploy(forestTokenAddress, stablecoinAddress, deployer.address);
    const marketplaceAddress = await marketplace.getAddress();
    console.log('Marketplace deployed to:', marketplaceAddress);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });