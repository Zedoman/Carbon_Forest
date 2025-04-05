import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MetaMaskSDK } from "@metamask/sdk";
import type { SDKProvider } from "@metamask/sdk";

// ABI imports from Hardhat artifacts
import CarbonForestTokenArtifact from "../../artifacts/contracts/CarbonForestToken.sol/CarbonForestToken.json";
import CarbonCreditArtifact from "../../artifacts/contracts/CarbonCredit.sol/CarbonCredit.json";
import StablecoinArtifact from "../../artifacts/contracts/CarbonStablecoin.sol/CarbonStablecoin.json";
import MarketplaceArtifact from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

// Extract ABIs
const CarbonForestTokenABI = CarbonForestTokenArtifact.abi;
const CarbonCreditABI = CarbonCreditArtifact.abi;
const StablecoinABI = StablecoinArtifact.abi;
const MarketplaceABI = MarketplaceArtifact.abi;

const CONTRACT_ADDRESSES = {
  CarbonForestToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  CarbonCredit: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  Stablecoin: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  Marketplace: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
} as const;

declare module "@metamask/sdk" {
  interface DappMetadata {
    icon?: string;
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

let sdk: MetaMaskSDK | null = null;

const initializeMetaMask = () => {
  if (!sdk) {
    sdk = new MetaMaskSDK({
      dappMetadata: {
        name: "Carbon Forest",
        url: window.location.href,
      },
      logging: {
        developerMode: true,
      },
      checkInstallationImmediately: true,
      storage: {
        enabled: true,
      },
      useDeeplink: false,
      preferDesktop: true,
      injectProvider: true,
    });
  }
  return sdk;
};

interface Contracts {
  carbonForestToken: ethers.Contract;
  carbonCredit: ethers.Contract;
  stablecoin: ethers.Contract;
  marketplace: ethers.Contract;
}

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contracts, setContracts] = useState<Partial<Contracts>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ethereum = window.ethereum;

    if (!ethereum) {
      const sdk = initializeMetaMask();
      ethereum = sdk.getProvider();
    }

    if (!ethereum) {
      setError("MetaMask provider not detected. Please ensure MetaMask is installed.");
      return;
    }

    const ethersProvider = new ethers.BrowserProvider(ethereum);
    setProvider(ethersProvider);

    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await initializeContracts(ethersProvider, accounts[0]);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
        setError("Failed to check wallet connection");
      }
    };

    checkConnection();

    // Listen for account changes
    ethereum.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAccount(null);
        setContracts({});
        setProvider(null);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
        const newProvider = new ethers.BrowserProvider(ethereum);
        setProvider(newProvider);
        await initializeContracts(newProvider, accounts[0]);
      }
    });

    // Listen for chain changes
    ethereum.on("chainChanged", async () => {
      if (account) {
        const newProvider = new ethers.BrowserProvider(ethereum);
        setProvider(newProvider);
        await initializeContracts(newProvider, account);
      }
    });

    // Listen for transaction rejections
    ethereum.on("error", (error: any) => {
      console.log("MetaMask error event:", error);
      if (error.code === "ACTION_REJECTED" || error.message.includes("rejected")) {
        // Trigger dashboard refresh when a transaction is rejected
        window.dispatchEvent(new Event("transactionRejected"));
      }
    });

    return () => {
      ethereum.removeAllListeners("accountsChanged");
      ethereum.removeAllListeners("chainChanged");
      ethereum.removeAllListeners("error");
    };
  }, []);

  const initializeContracts = async (ethersProvider: ethers.BrowserProvider, account: string) => {
    try {
      const signer = await ethersProvider.getSigner(account);

      const carbonForestToken = new ethers.Contract(
        CONTRACT_ADDRESSES.CarbonForestToken,
        CarbonForestTokenABI,
        signer
      );
      const carbonCredit = new ethers.Contract(
        CONTRACT_ADDRESSES.CarbonCredit,
        CarbonCreditABI,
        signer
      );
      const stablecoin = new ethers.Contract(
        CONTRACT_ADDRESSES.Stablecoin,
        StablecoinABI,
        signer
      );
      const marketplace = new ethers.Contract(
        CONTRACT_ADDRESSES.Marketplace,
        MarketplaceABI,
        signer
      );

      setContracts({
        carbonForestToken,
        carbonCredit,
        stablecoin,
        marketplace,
      });
    } catch (err) {
      console.error("Error initializing contracts:", err);
      setError("Failed to initialize contracts");
    }
  };

  const connectWallet = async () => {
    try {
      let ethereum = window.ethereum;
      if (!ethereum) {
        const sdk = initializeMetaMask();
        ethereum = sdk.getProvider();
      }

      if (!ethereum) {
        throw new Error("MetaMask provider not detected. Please ensure MetaMask is installed.");
      }

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        setProvider(ethersProvider);
        await initializeContracts(ethersProvider, accounts[0]);
        return accounts[0];
      } else {
        throw new Error("No accounts returned from MetaMask");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError((err as Error).message || "Failed to connect wallet");
      return null;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
    setContracts({});
    setError(null);
  };

  return {
    account,
    provider,
    contracts,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
  };
};