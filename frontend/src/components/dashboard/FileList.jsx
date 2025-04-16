import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFileStorage } from "../../hooks/useFileStorage";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  getFileTypeIcon,
  formatFileSize,
  truncateAddress,
} from "../../utils/helpers";
import IPFSService from "../../services/ipfsService";

const FileList = () => {
  const { getUserFiles, userFiles, isLoading } = useFileStorage();

  useEffect(() => {
    const fetchFiles = async () => {
      await getUserFiles();
    };

    fetchFiles();
  }, []);

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <LoadingSpinner />
        <p className="mt-2 text-gray-600">Loading your files...</p>
      </div>
    );
  }

  if (userFiles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">You haven't uploaded any files yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Your Files
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Stored securely on IPFS and the blockchain
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {userFiles.map((file) => (
            <li key={file.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <Link to={`/files/${file.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {getFileTypeIcon(file.type.split("/")[1])}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {file.name}
                      </p>
                      <p className="flex items-center text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {/* Wrap external link with a non-anchor element */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          IPFSService.getFileUrl(file.ipfsHash),
                          "_blank"
                        );
                      }}
                      className="mr-2 text-primary-600 hover:text-primary-800"
                    >
                      View
                    </button>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileList;
