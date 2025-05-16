const File = require("../models/FileGenerator");
const fileService = require("./fileService");

const getNextFileNumber = async (statePrefix) => {
  // Find all files with this state prefix
  const files = await File.find({
    fileNumber: new RegExp(`^${statePrefix}\\d+$`),
  })
    .sort({ fileNumber: -1 })
    .limit(1);

  if (files.length === 0) return `${statePrefix}01`;

  const lastNumber = parseInt(files[0].fileNumber.replace(statePrefix, ""));
  return `${statePrefix}${(lastNumber + 1).toString().padStart(2, "0")}`;
};

const getNextMRN = async (religionCode) => {
  // Find all MRNs with this religion code
  const files = await File.find({
    mrn: new RegExp(`-\\d+-\\d+${religionCode}$`),
  })
    .sort({ mrn: -1 })
    .limit(1);

  const currentYear = new Date().getFullYear();
  // const yearPart = (currentYear - 578).toString(); // Islamic calendar
  const yearPart = (currentYear - 579).toString(); // Islamic calendar

  if (files.length === 0) return `m263-${yearPart}-2501${religionCode}`;

  const lastMRN = files[0].mrn;
  const lastSequence = parseInt(
    lastMRN.split("-")[2].replace(religionCode, "")
  );
  return `m263-${yearPart}-${lastSequence + 1}${religionCode}`;
};

createFile = async (data, files = []) => {
  const statePrefix = data.stateOfOrigin.substring(0, 3).toUpperCase();
  const fileNumber = await getNextFileNumber(statePrefix);

  const religionCode = data.religion;
  const mrn = await getNextMRN(religionCode);

  const fileData = {
    ...data,
    fileNumber,
    mrn,
  };

  // First create the file document
  const createdFile = await File.create(fileData);

  // Then handle file uploads if needed
  if (files.length > 0) {
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
        fileService.associateFile(file._id, "FileGenerators", createdFile._id)
      )
    );
  }

  return createdFile;
};

const getAllFiles = async () => {
  try {
    const filesGens = await File.find({});

    const fileGenWithFiles = await Promise.all(
      filesGens.map(async (file) => {
        const files = await fileService.getFilesByDocument(
          "FileGenerators",
          file._id
        );
        return {
          ...file.toJSON(),
          files,
        };
      })
    );

    return { files: fileGenWithFiles };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFileById = async (id) => {
  try {
    const file = await File.findById(id);
    if (!file) {
      throw new Error("File not found");
    }
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateFile = async (id, data) => {
  try {
    const file = await File.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!file) {
      throw new Error("File not found");
    }
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFile = async (id) => {
  try {
    const file = await File.findByIdAndDelete(id);
    if (!file) {
      throw new Error("File not found");
    }
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFileByMrn = async (mrn) => {
  try {
    const file = await File.findOne({ mrn });
    if (!file) {
      throw new Error("File not found with this MRN");
    }
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile,
  getFileByMrn,
};
