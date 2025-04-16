import React from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import Button from "../common/Button";
import { truncateAddress } from "../../utils/helpers";

const WalletConnect = () => {
  const { connectWallet, isConnected, account, networkName, disconnectWallet } =
    useWeb3();

  if (isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Wallet Connected</h2>
        <p className="text-gray-600 mb-4">
          Your MetaMask wallet is connected to our dApp on the {networkName}{" "}
          network.
        </p>
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <p className="font-medium">Address</p>
          <p className="text-sm text-gray-700 break-all">{account}</p>
        </div>
        <Button type="danger" onClick={disconnectWallet}>
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-4">
        Connect your MetaMask wallet to access the decentralized storage system.
      </p>
      <Button onClick={connectWallet}>Connect MetaMask</Button>
    </div>
  );
};

export default WalletConnect;
