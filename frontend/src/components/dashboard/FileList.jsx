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
// import { toast } from "react-toastify";

const FileList = () => {
  const { getUserFiles, userFiles, isLoading, deleteUserFile } = useFileStorage();
  const [confirmingFile, setConfirmingFile] = useState(null); // for delete confirmation

  useEffect(() => {
    getUserFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await deleteUserFile(fileId); // you should have this in your hook/service
      // toast.success("File deleted successfully");
      getUserFiles(); // refresh list
    } catch (error) {
      // toast.error("Failed to delete file");
    } finally {
      setConfirmingFile(null);
    }
  };

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

  const sortedFiles = [...userFiles].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
          {sortedFiles.map((file) => (
            <li key={file.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <Link to={`/files/${file.id}`} className="flex items-center flex-grow">
                  <span className="text-2xl mr-3">{getFileTypeIcon(file.name)}</span>
                  <div>
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {file.name}
                    </p>
                    <p className="flex items-center text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </Link>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(IPFSService.getFileUrl(file.ipfsHash), "_blank");
                    }}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingFile(file); // show confirmation dialog
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔐 Delete Confirmation Modal */}
      {confirmingFile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete File</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{confirmingFile.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmingFile(null)}
                className="px-4 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmingFile.id)}
                className="px-4 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
