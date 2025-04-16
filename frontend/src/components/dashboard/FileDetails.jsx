import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFileStorage } from "../../hooks/useFileStorage";
import { useWeb3 } from "../../hooks/useWeb3";
import IPFSService from "../../services/ipfsService";
import { formatFileSize, getFileTypeIcon } from "../../utils/helpers";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const FileDetails = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { getFileDetails } = useFileStorage();
  const { account } = useWeb3();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        setLoading(true);
        const fileData = await getFileDetails(fileId);

        if (!fileData) {
          setError("File not found");
          return;
        }

        setFile(fileData);
      } catch (err) {
        console.error("Error fetching file details:", err);
        setError("Failed to load file details");
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error || "Something went wrong"}</p>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isOwner =
    account && file.owner && file.owner.toLowerCase() === account.toLowerCase();
  const fileExtension = file.name.split(".").pop();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            File Details
          </h3>
          <Button
            onClick={() => navigate("/dashboard")}
            type="secondary"
            size="sm"
          >
            Back to Files
          </Button>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start">
          <div className="sm:flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gray-100 text-gray-500">
              <span className="text-3xl">{getFileTypeIcon(fileExtension)}</span>
            </div>
          </div>
          <div className="sm:flex-1">
            <h3 className="text-xl font-bold text-gray-900">{file.name}</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Uploaded on {new Date(file.createdAt).toLocaleString()}</p>
              <p>Size: {formatFileSize(file.size)}</p>
              <p>Type: {file.type}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">IPFS Hash</h4>
            <p className="mt-1 text-sm text-gray-900 break-all">
              {file.ipfsHash}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Owner</h4>
            <p className="mt-1 text-sm text-gray-900 break-all">{file.owner}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
          <a
            href={IPFSService.getFileUrl(file.ipfsHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 mb-3 sm:mb-0"
          >
            View on IPFS
          </a>

          <Button type="danger" className="sm:ml-3">
            Delete File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
