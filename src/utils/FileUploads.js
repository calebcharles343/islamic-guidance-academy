const fileService = require("../services/fileService");

// Helper method for file uploads
const handleFileUploads = async ({ files, documentId, modelTable }) => {
  console.log("❌❌===>:", files, documentId, modelTable);
  const uploadedFiles = await Promise.all(
    files.map((file) =>
      fileService.uploadFile({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      })
    )
  );

  await Promise.all(
    uploadedFiles.map((file) =>
      fileService.associateFile(file._id, modelTable, documentId)
    )
  );
};

module.exports = handleFileUploads;
