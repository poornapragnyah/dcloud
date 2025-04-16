import { useState } from "react";
import { useWeb3 } from "./useWeb3";
import { uploadToIPFS } from "../services/ipfsService";
import { ethers } from "ethers";

export const useFileStorage = () => {
  const { contract, account } = useWeb3();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userFiles, setUserFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file) => {
    if (!contract || !account) return null;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // 1. Upload to IPFS
      const ipfsResult = await uploadToIPFS(file, (progress) => {
        setUploadProgress(10 + progress * 0.6); // 10-70% for IPFS upload
      });

      setUploadProgress(70);

      // 2. Store metadata on blockchain
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size.toString();
      const ipfsHash = ipfsResult.cid.toString();

      const tx = await contract.addFile(fileName, fileType, fileSize, ipfsHash);

      setUploadProgress(80);

      // 3. Wait for transaction confirmation
      const receipt = await tx.wait();

      setUploadProgress(100);
      setIsUploading(false);

      // 4. Return file metadata
      const fileId = receipt.events[0].args.fileId.toString();

      return {
        id: fileId,
        name: fileName,
        type: fileType,
        size: fileSize,
        ipfsHash,
        owner: account,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      return null;
    }
  };

  const getUserFiles = async () => {
    if (!contract || !account) return [];

    try {
      setIsLoading(true);

      const fileIds = await contract.getUserFiles();
      if (!fileIds || fileIds.length === 0) {
        setUserFiles([]);
        setIsLoading(false);
        return [];
      }
      const files = [];

      for (const fileId of fileIds) {
        const fileData = await contract.getFile(fileId);

        files.push({
          id: fileData.id.toString(),
          name: fileData.fileName,
          type: fileData.fileType,
          size: fileData.fileSize,
          ipfsHash: fileData.ipfsHash,
          owner: fileData.owner,
          createdAt: new Date(fileData.uploadTime * 1000).toISOString(),
        });
      }

      setUserFiles(files);
      setIsLoading(false);
      return files;
    } catch (error) {
      console.error("Error getting user files:", error);
      setIsLoading(false);
      return [];
    }
  };

  const getFileDetails = async (fileId) => {
    if (!contract) return null;

    try {
      const fileData = await contract.files(fileId);

      return {
        id: fileId,
        name: fileData.fileName,
        type: fileData.fileType,
        size: fileData.fileSize,
        ipfsHash: fileData.ipfsHash,
        owner: fileData.owner,
        createdAt: new Date(fileData.timestamp * 1000).toISOString(),
      };
    } catch (error) {
      console.error("Error getting file details:", error);
      return null;
    }
  };

  return {
    uploadFile,
    getUserFiles,
    getFileDetails,
    isUploading,
    uploadProgress,
    userFiles,
    isLoading,
  };
};
