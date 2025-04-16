import React from "react";
import { useParams } from "react-router-dom";
import FileDetails from "../components/dashboard/FileDetails";
import { useWeb3 } from "../hooks/useWeb3";
import WalletConnect from "../components/wallet/WalletConnect";

const FileView = () => {
  const { fileId } = useParams();
  const { isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">View File</h1>
        <div className="max-w-md mx-auto">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">File Details</h1>
      <FileDetails fileId={fileId} />
    </div>
  );
};

export default FileView;
