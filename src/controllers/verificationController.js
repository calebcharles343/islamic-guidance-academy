const verificationService = require("../services/verificationService");
const catchAsync = require("../utils/catchAsync");
const handleResponse = require("../utils/handleResponse");

const createVerification = catchAsync(async (req, res, next) => {
  const { form, photo } = req.body;

  if (!photo) {
    return handleResponse(res, 404, "Please provide your photo");
  }

  const verification = await verificationService.createVerification(
    form,
    photo
  );
  handleResponse(res, 201, "Verification created successfully", verification);
});

const getVerificationById = catchAsync(async (req, res, next) => {
  const verification = await verificationService.getVerificationById(
    req.params.id
  );
  handleResponse(res, 200, "Verification fetched successfully", verification);
});

const updateVerificationById = catchAsync(async (req, res, next) => {
  const verification = await verificationService.updateVerificationById(
    req.params.id,
    req.body
  );
  handleResponse(res, 200, "Verification updated successfully", verification);
});

const deleteVerificationById = catchAsync(async (req, res, next) => {
  await verificationService.deleteVerificationById(req.params.id);
  handleResponse(res, 204, "Verification deleted successfully");
});

const getAllVerifications = catchAsync(async (req, res, next) => {
  const verifications = await verificationService.getAllVerifications();
  handleResponse(res, 200, "Verifications fetched successfully", verifications);
});

module.exports = {
  createVerification,
  getVerificationById,
  updateVerificationById,
  deleteVerificationById,
  getAllVerifications,
};
