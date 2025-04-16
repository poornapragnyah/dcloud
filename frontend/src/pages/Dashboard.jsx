import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../hooks/useWeb3";
import WalletConnect from "../components/wallet/WalletConnect";
import WalletInfo from "../components/wallet/WalletInfo";
import FileUpload from "../components/dashboard/FileUpload";
import FileList from "../components/dashboard/FileList";
import TransactionHistory from "../components/dashboard/TransactionHistory";

const Dashboard = () => {
  const { isConnected } = useWeb3();
  const navigate = useNavigate();
  const [refreshFiles, setRefreshFiles] = useState(false);

  const handleFileUploaded = () => {
    setRefreshFiles(!refreshFiles);
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
        <div className="max-w-md mx-auto">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <WalletInfo />
          <div className="mt-6">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <FileList key={refreshFiles ? "refresh" : "normal"} />
          <div className="mt-6">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
