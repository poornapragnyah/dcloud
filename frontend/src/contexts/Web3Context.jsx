import React, { createContext, useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import FileStorageABI from "../utils/FileStorageABI.json";
import { CONTRACT_ADDRESS } from "../utils/constants";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const browserProvider = new BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();

        const contract = new Contract(CONTRACT_ADDRESS, FileStorageABI, signer);

        const network = await browserProvider.getNetwork();

        setAccount(accounts[0]);
        setProvider(browserProvider);
        setSigner(signer);
        setContract(contract);
        setIsConnected(true);
        setChainId(Number(network.chainId));
        setNetworkName(network.name);
        // console.log("Network:", network);

        return true;
      } else {
        console.error("No ethereum object found. Install MetaMask.");
        return false;
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setChainId(null);
    setNetworkName("");
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          connectWallet();
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        isConnected,
        chainId,
        networkName,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
