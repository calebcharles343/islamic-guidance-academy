const {
  getAllVerificationsService,
  getVerificationByIdService,
  updateVerificationByIdService,
  deleteVerificationByIdService,
  createVerificationService,
} = require("../services/verificationService");
const catchAsync = require("../utils/catchAsync");
const handleResponse = require("../utils/handleResponse");
const stationByToken = require("../utils/stationByToken");

const createVerification = catchAsync(async (req, res, next) => {
  const { form, photo } = req.body;
  const station = await stationByToken(req, res);

  if (!station) {
    return handleResponse(res, 401, "Invalid token");
  }

  const station_id = station._id;
  const stationNo = station.station;

  const verification = await createVerificationService(
    stationNo,
    station_id,
    form,
    photo
  );

  handleResponse(res, 201, "Verification created successfully", verification);
});

const getVerificationById = catchAsync(async (req, res, next) => {
  const verification = await getVerificationByIdService(req.params.id);
  handleResponse(res, 200, "Verification fetched successfully", verification);
});

const updateVerificationById = catchAsync(async (req, res, next) => {
  const { form, photo } = req.body;

  const verification = await updateVerificationByIdService(
    req.params.id,
    form,
    photo
  );
  handleResponse(res, 200, "Verification updated successfully", verification);
});

const deleteVerificationById = catchAsync(async (req, res, next) => {
  await deleteVerificationByIdService(req.params.id);
  handleResponse(res, 204, "Verification deleted successfully");
});

const getAllVerifications = catchAsync(async (req, res, next) => {
  const verifications = await getAllVerificationsService();
  handleResponse(res, 200, "Verifications fetched successfully", verifications);
});

module.exports = {
  createVerification,
  getVerificationById,
  updateVerificationById,
  deleteVerificationById,
  getAllVerifications,
};
