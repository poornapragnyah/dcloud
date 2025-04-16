export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const getFileTypeIcon = (fileName) => {
  // Ensure fileName is a string and contains a valid extension
  if (!fileName || !fileName.includes(".")) {
    return "📄"; // Return default icon if no extension is found
  }

  // Split and get the file extension
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  // Return appropriate icon based on file extension
  const fileTypes = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📊",
    pptx: "📊",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    mp3: "🎵",
    mp4: "🎬",
    default: "📄",
  };

  return fileTypes[ext] || fileTypes.default;
};
