import React from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import { truncateAddress } from "../../utils/helpers";

const WalletInfo = () => {
  const { account, isConnected, networkName, chainId } = useWeb3();

  if (!isConnected) {
    return null;
  }

  // Check if network is supported (Goerli)
  const isTestnet = chainId === 11155111;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium text-gray-700">Wallet Details</h3>
      <div className="mt-2 space-y-2">
        <div>
          <p className="text-xs text-gray-500">Address</p>
          <p className="text-sm font-medium">{truncateAddress(account)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Network</p>
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                isTestnet ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></span>
            <p className="text-sm font-medium">{networkName}</p>
          </div>
        </div>
        {!isTestnet && (
          <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            Please switch to Sepolia Test Network in MetaMask
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;
