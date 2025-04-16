import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/constants';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
    this.address = null;
  }

  async connect() {
    try {
      if (window.ethereum) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = this.provider.getSigner();
        this.address = await this.signer.getAddress();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
        this.isConnected = true;
        
        // Setup event listeners for account changes
        window.ethereum.on('accountsChanged', this.handleAccountChange.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChange.bind(this));
        
        return { success: true, address: this.address };
      } else {
        throw new Error('Ethereum wallet not detected');
      }
    } catch (error) {
      console.error('Connection error:', error);
      return { success: false, error: error.message };
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
    this.address = null;
    
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountChange);
      window.ethereum.removeListener('chainChanged', this.handleChainChange);
    }
    
    return { success: true };
  }

  handleAccountChange(accounts) {
    if (accounts.length === 0) {
      // User disconnected their wallet
      this.disconnect();
    } else {
      // User switched accounts
      this.address = accounts[0];
    }
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('walletAccountChanged', { detail: { address: this.address } }));
  }

  handleChainChange() {
    // Reload the page on chain change as recommended by MetaMask
    window.location.reload();
  }

  async registerFile(cid, name, description, size, fileType) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const tx = await this.contract.registerFile(cid, name, description, size, fileType);
      await tx.wait();
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('Error registering file:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserFiles() {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const files = await this.contract.getUserFiles();
      return { success: true, files };
    } catch (error) {
      console.error('Error fetching user files:', error);
      return { success: false, error: error.message };
    }
  }

  async getFileDetails(fileId) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const details = await this.contract.getFileDetails(fileId);
      return { success: true, details };
    } catch (error) {
      console.error('Error fetching file details:', error);
      return { success: false, error: error.message };
    }
  }

  async updateFileAccess(fileId, address, hasAccess) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const tx = await this.contract.updateFileAccess(fileId, address, hasAccess);
      await tx.wait();
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('Error updating file access:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteFile(fileId) {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const tx = await this.contract.deleteFile(fileId);
      await tx.wait();
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  async getTransactionHistory() {
    if (!this.isConnected) throw new Error('Wallet not connected');
    
    try {
      const history = await this.contract.getTransactionHistory();
      return { success: true, history };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return { success: false, error: error.message };
    }
  }

  getConnectedAddress() {
    return this.address;
  }

  isWalletConnected() {
    return this.isConnected;
  }
}

export default new Web3Service();
