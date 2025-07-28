const mrnModel = require("../models/Mrn");
const handleFileUploads = require("../utils/FileUploads");
const fileService = require("./fileService");
const moment = require("moment-hijri");

// Cache for last file numbers to reduce database queries
const fileNumberCache = new Map();

const getNextFileNumber = async (statePrefix) => {
  try {
    // Check cache first
    if (fileNumberCache.has(statePrefix)) {
      const lastNumber = fileNumberCache.get(statePrefix);
      const nextNumber = lastNumber + 1;
      fileNumberCache.set(statePrefix, nextNumber);
      return `${statePrefix}${nextNumber.toString().padStart(2, "0")}`;
    }

    const mrn = await mrnModel.findOne(
      { fileNumber: new RegExp(`^${statePrefix}\\d+$`) },
      { fileNumber: 1 },
      { sort: { fileNumber: -1 } }
    );

    if (!mrn) {
      fileNumberCache.set(statePrefix, 1);
      return `${statePrefix}01`;
    }

    const lastNumber = parseInt(mrn.fileNumber.replace(statePrefix, ""), 10);
    fileNumberCache.set(statePrefix, lastNumber + 1);
    return `${statePrefix}${(lastNumber + 1).toString().padStart(2, "0")}`;
  } catch (error) {
    throw new Error(`Error getting next file number: ${error.message}`);
  }
};

const getNextMRN = async (religion) => {
  try {
    const hijriYear = moment().iYear();
    const yy = new Date().getFullYear().toString().slice(-2);
    const prefix = `${religion}63-${hijriYear}-${yy}`;

    // More efficient query using $regex and projection
    const lastMRN = await mrnModel.findOne(
      { mrn: new RegExp(`^${prefix}\\d{2}$`) },
      { mrn: 1 },
      { sort: { mrn: -1 } }
    );

    let sequenceNumber;
    if (!lastMRN) {
      sequenceNumber = 1;
    } else {
      sequenceNumber = parseInt(lastMRN.mrn.slice(-2), 10) + 1;
    }

    return `${prefix}${sequenceNumber.toString().padStart(2, "0")}`;
  } catch (error) {
    throw new Error(`Error generating next MRN: ${error.message}`);
  }
};

const createMRN = async (user, data, files = []) => {
  try {
    const statePrefix = data.stateOfOrigin.substring(0, 3).toUpperCase();
    const [fileNumber, mrn] = await Promise.all([
      getNextFileNumber(statePrefix),
      getNextMRN(data.religion),
    ]);

    const fileData = {
      ...data,
      fileNumber,
      mrn,
      createdBy: user._id,
    };

    const createdMrn = await mrnModel.create(fileData);

    if (files.length > 0) {
      await handleFileUploads({
        files,
        documentId: createdMrn._id,
        modelTable: "Mrns",
      });
    }

    return createdMrn;
  } catch (error) {
    throw new Error(`Error creating file: ${error.message}`);
  }
};

const getAllMRNs = async (projection = null) => {
  try {
    const mrns = await mrnModel.find({}, projection).populate({
      path: "createdBy",
      select: "name email userName station department drn fileNumber phone",
    });

    // Only fetch files if no projection or if projection includes files
    const shouldFetchFiles =
      !projection ||
      (typeof projection === "object" &&
        !Object.keys(projection).some((k) => projection[k] === 0));

    if (!shouldFetchFiles) {
      return { files: mrns };
    }

    const mrnsWithFiles = await Promise.all(
      mrns.map(async (mrn) => ({
        ...mrn.toJSON(),
        files: await fileService.getFilesByDocument("Mrns", mrn._id),
      }))
    );

    return { files: mrnsWithFiles };
  } catch (error) {
    throw new Error(`Error getting all mrn: ${error.message}`);
  }
};

const getMRNById = async (id, projection = null) => {
  try {
    const mrn = await mrnModel.findById(id, projection).populate({
      path: "createdBy",
      select: "name email userName station department drn fileNumber phone",
    });
    if (!mrn) {
      throw new Error("MRN not found");
    }
    return mrn;
  } catch (error) {
    throw new Error(`Error getting MRN by ID: ${error.message}`);
  }
};

const updateMRN = async (id, data, files = []) => {
  try {
    const existingMRN = await mrnModel.findById(id);
    if (!existingMRN) {
      throw new Error("MRN not found");
    }

    let { mrn, fileNumber } = existingMRN;
    const updates = { ...data };

    // Only update fileNumber if stateOfOrigin changed
    if (
      data.stateOfOrigin &&
      data.stateOfOrigin !== existingMRN.stateOfOrigin
    ) {
      const statePrefix = data.stateOfOrigin.substring(0, 3).toUpperCase();
      fileNumber = await getNextFileNumber(statePrefix);
      updates.fileNumber = fileNumber;
    }

    // Only update MRN if religion changed
    if (data.religion && data.religion !== existingMRN.religion) {
      mrn = await getNextMRN(data.religion);
      updates.mrn = mrn;
    }

    const updatedMRN = await mrnModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (files.length > 0) {
      await handleFileUploads({
        files,
        documentId: updatedMRN._id,
        modelTable: "Mrns",
      });
    }

    return updatedMRN;
  } catch (error) {
    throw new Error(`Error updating MRN: ${error.message}`);
  }
};

const deleteMRN = async (id) => {
  try {
    const mrn = await mrnModel.findByIdAndDelete(id);
    if (!mrn) {
      throw new Error("MRN not found");
    }

    // Fire and forget file deletion
    fileService.deleteFilesByDocument("Mrns", id).catch(console.error);

    return mrn;
  } catch (error) {
    throw new Error(`Error deleting MRN: ${error.message}`);
  }
};

const getByMRN = async (mrnNumber, projection = null) => {
  try {
    const mrn = await mrnModel
      .findOne({ mrn: mrnNumber }, projection)
      .populate({
        path: "createdBy",
        select: "name email userName station department drn fileNumber phone",
      });

    if (!mrn) {
      throw new Error("MRN not found with this number");
    }
    return mrn;
  } catch (error) {
    throw new Error(`Error getting MRN by number: ${error.message}`);
  }
};

module.exports = {
  createMRN,
  getAllMRNs,
  getMRNById,
  updateMRN,
  deleteMRN,
  getByMRN,
};
