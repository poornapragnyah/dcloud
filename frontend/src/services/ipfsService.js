import axios from "axios";
import {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  IPFS_GATEWAY_URL,
} from "../utils/constants";

class IPFSService {
  constructor() {
    this.gatewayUrl = IPFS_GATEWAY_URL || "https://gateway.pinata.cloud/ipfs/";
    this.pinataApiUrl = "https://api.pinata.cloud";
    this.headers = {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    };
  }

  // Upload file to IPFS via Pinata
  async uploadToPinata(file, onProgress = () => {}) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Add metadata
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
      });
      formData.append("pinataMetadata", metadata);

      // Add pinning options
      const pinataOptions = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false,
      });
      formData.append("pinataOptions", pinataOptions);

      const response = await axios.post(
        `${this.pinataApiUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted / 100);
          },
        }
      );

      // Construct file metadata
      const fileData = {
        cid: response.data.IpfsHash,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: `${this.gatewayUrl}${response.data.IpfsHash}`,
      };
      // console.log("File uploaded to Pinata:", fileData);

      return { success: true, file: fileData };
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Upload JSON data to Pinata
  async uploadJsonToPinata(jsonData, name = "data.json") {
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name,
        },
        pinataContent: jsonData,
      });

      const response = await axios.post(
        `${this.pinataApiUrl}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            ...this.headers,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        cid: response.data.IpfsHash,
        url: `${this.gatewayUrl}${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error("Error uploading JSON to Pinata:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // List files pinned to Pinata
  async listPinned(filters = {}) {
    try {
      let queryParams = "";

      if (filters.name) {
        queryParams += `&metadata[name]=${encodeURIComponent(filters.name)}`;
      }

      if (filters.keyvalues) {
        for (const [key, value] of Object.entries(filters.keyvalues)) {
          queryParams += `&metadata[keyvalues][${key}]=${encodeURIComponent(
            value
          )}`;
        }
      }

      if (filters.status) {
        queryParams += `&status=${filters.status}`;
      }

      if (filters.limit) {
        queryParams += `&pageLimit=${filters.limit}`;
      }

      if (filters.offset) {
        queryParams += `&pageOffset=${filters.offset}`;
      }

      // Remove the first '&' if queryParams is not empty
      if (queryParams) {
        queryParams = "?" + queryParams.substring(1);
      }

      const response = await axios.get(
        `${this.pinataApiUrl}/data/pinList${queryParams}`,
        {
          headers: this.headers,
        }
      );

      // Format the response
      const files = response.data.rows.map((item) => ({
        cid: item.ipfs_pin_hash,
        name: item.metadata.name,
        size: item.size,
        created: new Date(item.date_pinned),
        url: `${this.gatewayUrl}${item.ipfs_pin_hash}`,
      }));

      return { success: true, files, count: response.data.count };
    } catch (error) {
      console.error("Error listing pins from Pinata:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Unpin a file from Pinata
  async unpinFromPinata(cid) {
    try {
      await axios.delete(`${this.pinataApiUrl}/pinning/unpin/${cid}`, {
        headers: this.headers,
      });

      return { success: true };
    } catch (error) {
      console.error("Error unpinning from Pinata:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Fetch file from IPFS gateway
  async fetchFromIPFS(cid) {
    try {
      const response = await fetch(`${this.gatewayUrl}${cid}`);

      if (!response.ok) {
        throw new Error(`Error fetching from IPFS: ${response.statusText}`);
      }

      return {
        success: true,
        data: await response.blob(),
        url: `${this.gatewayUrl}${cid}`,
      };
    } catch (error) {
      console.error("IPFS fetch error:", error);
      return { success: false, error: error.message };
    }
  }

  // Get the URL to access a file via the IPFS gateway
  getFileUrl(cid) {
    return `${this.gatewayUrl}${cid}`;
  }

  // Utility function to check if a CID is valid
  isValidCID(cid) {
    // Basic CID validation
    return cid && typeof cid === "string" && cid.length > 8;
  }
}

export default new IPFSService();
