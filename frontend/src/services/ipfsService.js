import { create } from "ipfs-http-client";
import axios from "axios";
import { BACKEND_API, IPFS_GATEWAY } from "../utils/constants";

// Setup IPFS client - assuming your backend proxies IPFS requests
// If using a direct IPFS node, you would need to handle authentication differently
export const ipfsClient = create({
  url: `${BACKEND_API}/ipfs`,
});

// Upload file to IPFS
export const uploadToIPFS = async (file, onProgress = () => {}) => {
  try {
    // For large files, we'll use the backend to handle IPFS uploads
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BACKEND_API}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted / 100);
      },
    });

    return { cid: response.data.cid };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

export const getIPFSUrl = (cid) => {
  return `${IPFS_GATEWAY}${cid}`;
};
