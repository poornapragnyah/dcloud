import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../hooks/useWeb3";
import WalletConnect from "../components/wallet/WalletConnect";
import Button from "../components/common/Button";

const Home = () => {
  const { isConnected } = useWeb3();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Decentralized</span>{" "}
            <span className="block text-primary-600 xl:inline">
              Cloud Storage
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Store your files securely on the decentralized web. Powered by
            Ethereum blockchain and IPFS.
          </p>
          <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
            {isConnected ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <p className="text-base font-medium text-gray-900">
                Connect your wallet to get started.
              </p>
            )}
          </div>
          <div className="mt-6">
            <div className="inline-flex items-center">
              <svg
                className="h-6 w-6 text-green-500"
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
              <p className="ml-2 text-gray-700">No central authority</p>
            </div>
            <div className="inline-flex items-center mt-2 ml-4">
              <svg
                className="h-6 w-6 text-green-500"
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
              <p className="ml-2 text-gray-700">Censorship resistant</p>
            </div>
            <div className="inline-flex items-center mt-2 ml-4">
              <svg
                className="h-6 w-6 text-green-500"
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
              <p className="ml-2 text-gray-700">User-owned data</p>
            </div>
          </div>
        </div>
        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
          <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
            <WalletConnect />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
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
            <h3 className="text-lg font-medium text-gray-900">
              Connect Wallet
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Connect your Ethereum wallet like MetaMask to our decentralized
              application.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Upload Files</h3>
            <p className="mt-2 text-base text-gray-500">
              Upload your files to IPFS, a distributed file system for storing
              and accessing files.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Secure Ownership
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Your file ownership is secured on the Ethereum blockchain with
              smart contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
