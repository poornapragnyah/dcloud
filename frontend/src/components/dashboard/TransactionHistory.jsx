import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import LoadingSpinner from "../common/LoadingSpinner";
import { truncateAddress } from "../../utils/helpers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { id, toBeHex } from "ethers";

const TransactionHistory = () => {
  const { account, provider } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account || !provider) return;

      try {
        setLoading(true);

        const latestBlock = await provider.getBlockNumber();
        const fromBlock = 0;
        const toBlock = latestBlock;

        const filter = {
          fromBlock: toBeHex(fromBlock),
          toBlock: toBeHex(toBlock),
          address: CONTRACT_ADDRESS,
          topics: [
            id(
              "FileUploaded(uint256,address,string,string,string,string,uint256)"
            ),
          ],
        };

        const logs = await provider.getLogs(filter);
        
        const txList = await Promise.all(
          logs.map(async (log) => {
            const tx = await provider.getTransaction(log.transactionHash);
            const receipt = await provider.getTransactionReceipt(
              log.transactionHash
            );
            const block = await provider.getBlock(log.blockNumber);

            return {
              hash: log.transactionHash,
              from: tx.from,
              to: tx.to,
              blockNumber: log.blockNumber,
              timestamp: block.timestamp * 1000,
              status: receipt.status === 1 ? "Success" : "Failed",
              gasUsed: receipt.gasUsed.toString(),
            };
          })
        );

        const userTransactions = txList.filter(tx => 
          tx.from.toLowerCase() === account.toLowerCase()
        );

        setTransactions(userTransactions.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account, provider]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="flex justify-center py-6">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-500 text-center py-4">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Hash
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.hash}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                  >
                    {truncateAddress(tx.hash)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
