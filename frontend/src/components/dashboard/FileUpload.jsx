// src/components/dashboard/FileUpload.jsx
import React, { useState, useRef } from "react";
import { useFileStorage } from "../../hooks/useFileStorage";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatFileSize } from "../../utils/helpers";

const FileUpload = ({ onFileUploaded }) => {
  const { uploadFile, isUploading, uploadProgress } = useFileStorage();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile);

    if (result) {
      setSelectedFile(null);
      if (onFileUploaded) {
        onFileUploaded(result);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center ${
          dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <div className="mb-4">
            <p className="text-lg font-medium">{selectedFile.name}</p>
            <p className="text-gray-500">{formatFileSize(selectedFile.size)}</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-2">Drag and drop file here, or</p>
            <Button onClick={handleButtonClick} type="secondary">
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {isUploading ? (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-gray-600">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      ) : selectedFile ? (
        <div className="flex justify-end">
          <Button
            onClick={() => setSelectedFile(null)}
            type="secondary"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleUpload}>Upload to IPFS</Button>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
