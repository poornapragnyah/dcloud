# DCloud - Decentralized Cloud Storage

**DCloud** is a decentralized cloud storage application built on the **Ethereum blockchain** and **IPFS (InterPlanetary File System)**. It allows users to securely store, access, and share files without relying on centralized servers.

---

## 🚀 Features

- **Decentralized Storage**: Files are stored on IPFS, with metadata recorded on the Ethereum blockchain.
- **File Ownership**: Smart contracts verify and enforce file ownership.
- **File Sharing**: Share files using Ethereum wallet addresses.
- **Wallet Integration**: Seamless MetaMask support.
- **Transaction History**: View all file-related blockchain activities.
- **Responsive UI**: Modern interface built with React and TailwindCSS

---

## 🛠️ Technology Stack

### Frontend
- **React** – UI framework  
- **Vite** – Fast build tool  
- **TailwindCSS** – Utility-first CSS framework  
- **Ethers.js** – Ethereum blockchain interaction  
- **React Router** – Navigation and routing  
- **React Toastify** – Notifications system  

### Backend / Blockchain
- **Solidity** – Smart contract language  
- **IPFS / Pinata** – Decentralized file storage  
- **Ethereum (Sepolia testnet)** – Blockchain network  

---

## ⚙️ Architecture

DCloud uses a hybrid architecture:

- **Files**: Stored on IPFS with unique content identifiers (CIDs)
- **Metadata**: Stored on the Ethereum blockchain for ownership and access control
- **Smart Contract**: Manages file ownership, permissions, and sharing

---

## 🚧 Getting Started

### Prerequisites

- Node.js (v16+)
- MetaMask browser extension
- Sepolia ETH for gas fees

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/poornapragnyah/dcloud.git
   cd dcloud
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file based on `constants.example.js`:
   ```env
   CONTRACT_ADDRESS=your_deployed_contract_address
   IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_key
   GOERLI_RPC_URL=your_goerli_rpc_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Smart Contract

The `FileStorage.sol` contract includes:

- `addFile`: Upload file metadata to the blockchain
- `getUserFiles`: Fetch all user-uploaded files
- `getFile`: Get metadata of a specific file
- `deleteFile`: Delete a file (owner only)
- `shareFile`: Share a file with another user
- `getFilesSharedWithMe`: View files shared with the current user

---

## 🧑‍💻 Usage Guide

### Connecting Wallet
- Open the app
- Click "Connect Wallet"
- Approve MetaMask connection

### Uploading Files
- Go to Dashboard
- Use the upload area to drag/drop or select files
- Confirm the transaction in MetaMask

### Viewing Files
- Dashboard shows your files and shared ones
- Click "View" to open files via IPFS

### Sharing Files
- Find the file → Click "Share"
- Enter recipient's Ethereum address
- Confirm the MetaMask transaction

### Deleting Files
- Locate the file → Click "Delete"
- Confirm in the modal
- Approve the transaction in MetaMask

---

## 📁 Project Structure

```
dcloud/
├── contract.sol                # Ethereum smart contract
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components 
│   │   ├── contexts/           # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API and blockchain services
│   │   ├── utils/              # Helper functions and constants
│   │   └── App.jsx             # Main application component
│   ├── index.html              # HTML entry point
│   ├── package.json            # Dependencies and scripts
│   └── vite.config.js          # Vite configuration
```
