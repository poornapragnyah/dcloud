import { useState } from "react";
import { useWeb3 } from "./useWeb3";
import ipfsService from "../services/ipfsService";
import { ethers } from "ethers";
//import { toast } from "react-toastify";

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

      const ipfsResult = await ipfsService.uploadToPinata(file, (progress) => {
        setUploadProgress(10 + progress * 0.6);
      });

      setUploadProgress(70);

      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size.toString();
      const ipfsHash = ipfsResult.file.cid.toString();

      const tx = await contract.addFile(fileName, fileType, fileSize, ipfsHash);
      setUploadProgress(80);

      const receipt = await tx.wait();
      console.log("Transaction Receipt:", receipt);

      setUploadProgress(100);
      setIsUploading(false);

      const blockTimestamp = await tx.getBlock().then((block) => block.timestamp);
      const createdAt = new Date(blockTimestamp * 1000).toISOString();

      const fileId = receipt.events[0].args.fileId.toString();
      console.log("owner", account);

      return {
        id: fileId,
        name: fileName,
        type: fileType,
        size: fileSize,
        ipfsHash,
        owner: account,
        createdAt: createdAt,
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
          createdAt: new Date(Number(fileData[6]) * 1000).toISOString(),
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
      const fileData = await contract.getFile(fileId);
      const timestamp = fileData.timestamp instanceof BigInt
        ? Number(fileData.timestamp)
        : fileData.timestamp;

      return {
        id: fileId,
        name: fileData.fileName,
        type: fileData.fileType,
        size: fileData.fileSize,
        ipfsHash: fileData.ipfsHash,
        owner: fileData.owner,
        createdAt: new Date(Number(timestamp) * 1000).toISOString(),
      };
    } catch (error) {
      console.error("Error getting file details:", error);
      return null;
    }
  };

  const deleteUserFile = async (fileId) => {
    if (!contract || !account) return;

    try {
      setIsLoading(true);

      // First get the file details to get the IPFS hash
      const fileData = await contract.getFile(fileId);
      const ipfsHash = fileData.ipfsHash;
      if (!ipfsHash) {
        console.error("No IPFS hash found for the file");
        setIsLoading(false);
        return;
      }
      console.log("Deleting file with ID:", fileId);

      // Delete from blockchain first
      const tx = await contract.deleteFile(fileId);
      await tx.wait();

      // Then remove from Pinata
      if (ipfsHash) {
        try {
          const result = await ipfsService.unpinFromPinata(ipfsHash);
          console.log("Unpinning result:", result);
          if (!result.success) {
            console.error("Failed to unpin from Pinata:", result.error);
          }
        } catch (pinataError) {
          console.error("Error unpinning from Pinata:", pinataError);
          // We don't throw here as the blockchain deletion was successful
        }
      }

      // Update local state
      setUserFiles((prev) => prev.filter((file) => file.id !== fileId));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting file:", error);
      setIsLoading(false);
      throw error; // Re-throw to handle in the UI
    }
  };

  const shareFile = async (fileId, recipientAddress) => {
    if (!contract || !account) return;

    try {
      setIsLoading(true);
      const tx = await contract.shareFile(fileId, recipientAddress);
      await tx.wait();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error sharing file:", error);
      setIsLoading(false);
      return false;
    }
  };

  const getSharedFiles = async () => {
    if (!contract || !account) return [];
    try {
      setIsLoading(true);
      const fileIds = await contract.getFilesSharedWithMe();
      const sharedFiles = [];
      
      for (const fileId of fileIds) {
        const fileData = await contract.getFile(fileId);
        
        // Properly handle BigInt timestamp conversion
        let formattedDate = null;
        try {
          // Convert BigInt to string first, then to number
          const timestamp = Number(fileData.timestamp.toString()) * 1000;
          formattedDate = new Date(timestamp).toISOString();
        } catch (err) {
          console.warn("Invalid timestamp for file", fileId, err);
        }
        
        sharedFiles.push({
          id: fileId.toString(),
          name: fileData.fileName,
          type: fileData.fileType,
          size: fileData.fileSize,
          ipfsHash: fileData.ipfsHash,
          owner: fileData.uploader,
          createdAt: formattedDate,
          sharedBy: fileData.uploader
        });
      }
  
      setIsLoading(false);
      return sharedFiles;
    } catch (error) {
      console.error("Error getting shared files:", error);
      setIsLoading(false);
      return [];
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
    deleteUserFile,
    shareFile,
    getSharedFiles,
  };
};