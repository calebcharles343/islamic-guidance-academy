const Verification = require("../models/VerificationModel.js");
const AppError = require("../utils/appError");
const { cloudinary } = require("../utils/cloudinary.js");

const createVerification = async (form, photo) => {
  // Ensure folder name is safe (replace spaces or special characters)
  const folderName = form.name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");

  // Upload photo to the specific folder
  const uploadedResponse = await cloudinary.uploader.upload(photo, {
    folder: `verifications/${folderName}`, // Define folder path
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // Resize to fit within 800x800 while maintaining aspect ratio
      { quality: "auto" }, // Automatically adjust quality
    ],
  });

  const data = { ...form, photo: uploadedResponse.url };

  const verification = await Verification.create(data);

  return { verification, uploadedResponse };
};

const getVerificationById = async (id) => {
  const verification = await Verification.findById(id);
  if (!verification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }
  return verification;
};

const updateVerificationById = async (id, data) => {
  const verification = await Verification.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!verification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }
  return verification;
};

const deleteVerificationById = async (id) => {
  const verification = await Verification.findByIdAndDelete(id);
  if (!verification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }
  return verification;
};

const getAllVerifications = async () => {
  const verifications = await Verification.find();
  return verifications;
};

module.exports = {
  createVerification,
  getVerificationById,
  updateVerificationById,
  deleteVerificationById,
  getAllVerifications,
};
