import { useState, useEffect, useCallback } from 'react';
import ipfsService from '../services/ipfsService';

const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Upload a file to Pinata
  const uploadFile = useCallback(async (file) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const onProgress = (progress) => {
        setUploadProgress(progress * 100);
      };
      
      const result = await ipfsService.uploadToPinata(file, onProgress);
      setIsUploading(false);
      
      if (!result.success) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return result;
    } catch (err) {
      setIsUploading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Upload multiple files to Pinata
  const uploadFiles = useCallback(async (files) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    const results = [];
    const failures = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await ipfsService.uploadToPinata(
          files[i], 
          (progress) => {
            // Calculate overall progress
            const fileProgress = progress * (1 / files.length);
            const previousFilesProgress = i / files.length;
            setUploadProgress((previousFilesProgress + fileProgress) * 100);
          }
        );
        
        if (result.success) {
          results.push(result.file);
        } else {
          failures.push({ file: files[i].name, error: result.error });
        }
      } catch (err) {
        failures.push({ file: files[i].name, error: err.message });
      }
    }
    
    setIsUploading(false);
    
    if (failures.length > 0) {
      setError(`${failures.length} file(s) failed to upload`);
    }
    
    return { 
      success: failures.length === 0, 
      files: results, 
      failures 
    };
  }, []);

  // Upload JSON data to Pinata
  const uploadJson = useCallback(async (jsonData, name = "data.json") => {
    setError(null);
    setIsUploading(true);
    
    try {
      const result = await ipfsService.uploadJsonToPinata(jsonData, name);
      setIsUploading(false);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setIsUploading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch file from IPFS gateway
  const fetchFile = useCallback(async (cid) => {
    setError(null);
    
    try {
      return await ipfsService.fetchFromIPFS(cid);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Refresh the list of pinned files
  const refreshPinnedFiles = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ipfsService.listPinned(filters);
      
      if (result.success) {
        setPinnedFiles(result.files);
      } else {
        setError(result.error);
      }
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Unpin a file from Pinata
  const unpinFile = useCallback(async (cid) => {
    setError(null);
    
    try {
      const result = await ipfsService.unpinFromPinata(cid);
      
      if (result.success) {
        setPinnedFiles(prev => prev.filter(file => file.cid !== cid));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Get file URL from CID
  const getFileUrl = useCallback((cid) => {
    if (!ipfsService.isValidCID(cid)) {
      return null;
    }
    return ipfsService.getFileUrl(cid);
  }, []);

  return {
    isUploading,
    uploadProgress,
    error,
    pinnedFiles,
    isLoading,
    uploadFile,
    uploadFiles,
    uploadJson,
    fetchFile,
    refreshPinnedFiles,
    unpinFile,
    getFileUrl,
  };
};

export default useIPFS;
