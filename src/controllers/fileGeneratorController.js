const fileGeneratorService = require("../services/fileGeneratorService");

const createFile = async (req, res, next) => {
  try {
    const file = await fileGeneratorService.createFile(req.body);
    res.status(201).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFiles = async (req, res, next) => {
  try {
    const files = await fileGeneratorService.getAllFiles();
    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

const getFileById = async (req, res, next) => {
  try {
    const file = await fileGeneratorService.getFileById(req.params.id);
    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const file = await fileGeneratorService.updateFile(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    await fileGeneratorService.deleteFile(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getFileByMrn = async (req, res, next) => {
  try {
    const file = await fileGeneratorService.getFileByMrn(req.params.mrn);
    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
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
