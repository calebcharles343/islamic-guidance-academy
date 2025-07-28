const mrnService = require("../services/mrnService");
const catchAsync = require("../utils/catchAsync");
const userByToken = require("../middleware/userByToken");
const handleResponse = require("../utils/handleResponse");

const createMRN = catchAsync(async (req, res, next) => {
  const files = req.files || [];
  const user = await userByToken(req, res);
  const file = await mrnService.createMRN(user, req.body, files);
  handleResponse(res, 201, "success", file);
});

const getAllMRNs = catchAsync(async (req, res, next) => {
  const files = await mrnService.getAllMRNs();
  handleResponse(res, 200, "success", files);
});

const getMRNById = catchAsync(async (req, res, next) => {
  const file = await mrnService.getMRNById(req.params.id);
  handleResponse(res, 200, "success", file);
});

const updateMRN = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const files = req.files || [];

  const file = await mrnService.updateMRN(id, data, files);
  handleResponse(res, 200, "success", file);
});

const deleteMRN = catchAsync(async (req, res, next) => {
  await mrnService.deleteMRN(req.params.id);
  handleResponse(res, 200, "File deleted successfully");
});

const getByMRN = catchAsync(async (req, res, next) => {
  const file = await mrnService.getByMRN(req.params.mrn);
  handleResponse(res, 200, "success", file);
});

module.exports = {
  createMRN,
  getAllMRNs,
  getMRNById,
  updateMRN,
  deleteMRN,
  getByMRN,
};
