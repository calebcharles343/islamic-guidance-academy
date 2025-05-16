const fileGeneratorService = require("../services/fileGeneratorService");
const catchAsync = require("../utils/catchAsync");
const handleResponse = require("../utils/handleResponse");

const createFile = catchAsync(async (req, res, next) => {
  const files = req.files || [];
  const file = await fileGeneratorService.createFile(req.body, files);
  handleResponse(res, 201, "success", file);
});

const getAllFiles = catchAsync(async (req, res, next) => {
  const files = await fileGeneratorService.getAllFiles();
  handleResponse(res, 200, "success", files);
});

const getFileById = catchAsync(async (req, res, next) => {
  const file = await fileGeneratorService.getFileById(req.params.id);
  handleResponse(res, 200, "success", file);
});

const updateFile = catchAsync(async (req, res, next) => {
  const file = await fileGeneratorService.updateFile(req.params.id, req.body);
  handleResponse(res, 200, "success", file);
});

const deleteFile = catchAsync(async (req, res, next) => {
  await fileGeneratorService.deleteFile(req.params.id);
  handleResponse(res, 200, "File deleted successfully");
});

const getFileByMrn = catchAsync(async (req, res, next) => {
  const file = await fileGeneratorService.getFileByMrn(req.params.mrn);
  handleResponse(res, 200, "success", file);
});

module.exports = {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile,
  getFileByMrn,
};
