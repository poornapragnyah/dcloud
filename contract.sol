// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    uint256 private fileCounter;

    struct File {
        uint256 id;
        string fileName;
        string fileType;
        string fileSize;
        string ipfsHash;
        address uploader;
        uint256 timestamp;
    }

    mapping(uint256 => File) private files;
    mapping(address => uint256[]) private userFiles;

    event FileUploaded(
        uint256 indexed fileId,
        address indexed uploader,
        string fileName,
        string fileType,
        string fileSize,
        string ipfsHash,
        uint256 timestamp
    );

    event FileDeleted(uint256 indexed fileId, address indexed user);

    function addFile(
        string memory fileName,
        string memory fileType,
        string memory fileSize,
        string memory ipfsHash
    ) public returns (uint256 fileId) {
        require(bytes(fileName).length > 0, "File name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        fileCounter++;
        fileId = fileCounter;

        files[fileId] = File({
            id: fileId,
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            ipfsHash: ipfsHash,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        userFiles[msg.sender].push(fileId);

        emit FileUploaded(fileId, msg.sender, fileName, fileType, fileSize, ipfsHash, block.timestamp);
        return fileId;
    }

    function getUserFiles() public view returns (uint256[] memory) {
        return userFiles[msg.sender];
    }

    function getFile(uint256 fileId) public view returns (
        uint256 id,
        string memory fileName,
        string memory fileType,
        string memory fileSize,
        string memory ipfsHash,
        address uploader,
        uint256 timestamp
    ) {
        require(fileId > 0 && fileId <= fileCounter, "Invalid file ID");

        File memory file = files[fileId];

        return (
            file.id,
            file.fileName,
            file.fileType,
            file.fileSize,
            file.ipfsHash,
            file.uploader,
            file.timestamp
        );
    }

    function getTotalFiles() public view returns (uint256) {
        return fileCounter;
    }

    function deleteFile(uint256 fileId) public {
        require(files[fileId].uploader == msg.sender, "Only uploader can delete this file");

        // Remove fileId from userFiles array
        uint256[] storage fileIds = userFiles[msg.sender];
        for (uint i = 0; i < fileIds.length; i++) {
            if (fileIds[i] == fileId) {
                fileIds[i] = fileIds[fileIds.length - 1];
                fileIds.pop();
                break;
            }
        }

        delete files[fileId];

        emit FileDeleted(fileId, msg.sender);
    }
}