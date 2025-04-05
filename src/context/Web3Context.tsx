import React, { createContext, useContext, ReactNode } from 'react';
import { useMetaMask } from '../utils/metamask';
import { ethers } from 'ethers';

interface Web3ContextValue {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  contracts: Partial<{
    carbonForestToken: ethers.Contract;
    carbonCredit: ethers.Contract;
    stablecoin: ethers.Contract;
    marketplace: ethers.Contract;
  }>;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
}

const defaultContextValue: Web3ContextValue = {
  account: null,
  provider: null,
  contracts: {},
  isConnected: false,
  error: null,
  connect: async () => null,
  disconnect: () => {},
};

const Web3Context = createContext<Web3ContextValue>(defaultContextValue);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    account,
    provider,
    contracts,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
  } = useMetaMask();

  const connect = async () => {
    return await connectWallet();
  };

  const disconnect = () => {
    disconnectWallet();
  };

  const value: Web3ContextValue = {
    account,
    provider,
    contracts,
    isConnected,
    error,
    connect,
    disconnect,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3ContextValue => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};