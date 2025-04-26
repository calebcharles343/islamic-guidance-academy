const File = require("../models/FileGenerator");

const createFile = async (data) => {
  try {
    const file = await File.create(data);
    return file;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllFiles = async () => {
  try {
    const files = await File.find({});
    return files;
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
