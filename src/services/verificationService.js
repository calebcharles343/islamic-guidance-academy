const Verification = require("../models/VerificationModel.js");
const AppError = require("../utils/appError");
const { cloudinary } = require("../utils/cloudinary.js");

const createVerificationService = async (station, station_id, form, photo) => {
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

  const data = { station, station_id, ...form, photo: uploadedResponse.url };

  const verification = await Verification.create(data);

  return { verification, uploadedResponse };
};

const getVerificationByIdService = async (verificationId) => {
  const verification = await Verification.findById(verificationId);

  if (!verification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }
  return verification;
};

const getAllVerificationsService = async () => {
  const verifications = await Verification.find();
  return verifications;
};

const updateVerificationByIdService = async (id, data, photo = null) => {
  // Find the existing verification record
  const existingVerification = await Verification.findById(id);
  if (!existingVerification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }

  // Extract form.name and determine if folderName needs updating
  const currentFolderName = existingVerification.name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  const newFolderName = data.form?.name
    ? data.form.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
    : currentFolderName;

  // Handle photo replacement
  let uploadedResponse = null;
  if (photo) {
    // Delete existing photo if it exists
    if (existingVerification.photo) {
      const publicId = existingVerification.photo
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(
        `verifications/${currentFolderName}/${publicId}`
      );
    }

    // Upload the new photo to the updated folder
    uploadedResponse = await cloudinary.uploader.upload(photo, {
      folder: `verifications/${newFolderName}`,
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
      ],
    });

    // Update photo URL in data
    data.photo = uploadedResponse.url;
  }

  // If the folder name changed but no photo update, move existing photo
  if (
    !photo &&
    currentFolderName !== newFolderName &&
    existingVerification.photo
  ) {
    const publicId = existingVerification.photo.split("/").pop().split(".")[0];
    await cloudinary.uploader.rename(
      `verifications/${currentFolderName}/${publicId}`,
      `verifications/${newFolderName}/${publicId}`
    );
  }

  // Update verification record in the database
  const updatedVerification = await Verification.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return { updatedVerification, uploadedResponse };
};

const deleteVerificationByIdService = async (id) => {
  // Find and delete the verification record
  const verification = await Verification.findByIdAndDelete(id);
  if (!verification) {
    throw new AppError(`Verification with ID ${id} not found`, 404);
  }

  // Extract folder name from the verification
  const folderName = verification.name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");

  // Destroy the Cloudinary folder
  await cloudinary.api
    .delete_folder(`verifications/${folderName}`)
    .catch((err) => {
      console.error(`Failed to delete Cloudinary folder: ${err.message}`);
    });

  return verification;
};

module.exports = {
  createVerificationService,
  getVerificationByIdService,
  updateVerificationByIdService,
  deleteVerificationByIdService,
  getAllVerificationsService,
};
