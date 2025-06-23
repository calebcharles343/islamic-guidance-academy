const mrnModel = require("../models/Mrn");
const handleFileUploads = require("../utils/FileUploads");
const fileService = require("./fileService");

const getNextFileNumber = async (statePrefix) => {
  try {
    const mrns = await mrnModel
      .find({
        fileNumber: new RegExp(`^${statePrefix}\\d+$`),
      })
      .sort({ fileNumber: -1 })
      .limit(1);

    if (mrns.length === 0) return `${statePrefix}01`;

    const lastNumber = parseInt(mrns[0].fileNumber.replace(statePrefix, ""));
    return `${statePrefix}${(lastNumber + 1).toString().padStart(2, "0")}`;
  } catch (error) {
    throw new Error(`Error getting next file number: ${error.message}`);
  }
};

const getNextMRN = async () => {
  try {
    const mrns = await mrnModel
      .find({
        mrn: new RegExp(`^m263-\\d+-\\d+$`), // Match format without religion code
      })
      .sort({ mrn: -1 })
      .limit(1);

    const currentYear = new Date().getFullYear();
    const yearPart = (currentYear - 579).toString(); // Islamic calendar

    if (mrns.length === 0) return `m263-${yearPart}-2501`;

    const lastMRN = mrns[0].mrn;
    const lastSequence = parseInt(lastMRN.split("-")[2]);
    return `m263-${yearPart}-${(lastSequence + 1).toString().padStart(4, "0")}`;
  } catch (error) {
    throw new Error(`Error getting next MRN: ${error.message}`);
  }
};

const createMRN = async (data, files = []) => {
  try {
    const statePrefix = data.stateOfOrigin.substring(0, 3).toUpperCase();
    const fileNumber = await getNextFileNumber(statePrefix);

    // const religionCode = data.religion;
    const mrn = await getNextMRN();

    const fileData = {
      ...data,
      fileNumber,
      mrn, // Using lowercase to match model
    };

    // First create the file document
    const createdFile = await mrnModel.create(fileData);

    // Then handle file uploads if needed
    if (files.length > 0) {
      await handleFileUploads({
        files,
        documentId: mrn._id,
        modelTable: "Mrns",
      });
    }

    return createdFile;
  } catch (error) {
    throw new Error(`Error creating file: ${error.message}`);
  }
};

const getAllMRNs = async () => {
  try {
    const mrns = await mrnModel.find({});

    const mrnsWithFiles = await Promise.all(
      mrns.map(async (mrn) => {
        const files = await fileService.getFilesByDocument("Mrns", mrn._id);
        return {
          ...mrn.toJSON(),
          files,
        };
      })
    );

    return { files: mrnsWithFiles };
  } catch (error) {
    throw new Error(`Error getting all mrn: ${error.message}`);
  }
};

const getMRNById = async (id) => {
  try {
    const mrn = await mrnModel.findById(id);
    if (!mrn) {
      throw new Error("MRN not found");
    }
    return mrn;
  } catch (error) {
    throw new Error(`Error getting MRN by ID: ${error.message}`);
  }
};

// const updateMRN = async (id, data, files = []) => {
//   try {
//     // Prevent MRN and fileNumber from being updated
//     const { mrn, fileNumber, ...updateData } = data;

//     const updatedMRN = await mrnModel.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedMRN) {
//       throw new Error("MRN not found");
//     }

//     if (files.length > 0) {
//       await handleFileUploads({
//         files,
//         documentId: updatedMRN._id,
//         modelTable: "Mrns",
//       });
//     }

//     return updatedMRN;
//   } catch (error) {
//     throw new Error(`Error updating MRN: ${error.message}`);
//   }
// };

const updateMRN = async (id, data, files = []) => {
  try {
    // First get the existing MRN
    const existingMRN = await mrnModel.findById(id);
    if (!existingMRN) {
      throw new Error("MRN not found");
    }

    // Determine if we need to generate a new MRN
    let mrn = existingMRN.mrn;
    let fileNumber = existingMRN.fileNumber;

    // If state of origin changed, generate new file number
    if (
      data.stateOfOrigin &&
      data.stateOfOrigin !== existingMRN.stateOfOrigin
    ) {
      const statePrefix = data.stateOfOrigin.substring(0, 3).toUpperCase();
      fileNumber = await getNextFileNumber(statePrefix);
    }

    // If religion changed or we want to regenerate MRN for some reason
    // Note: Typically MRNs shouldn't change, so this might be conditional
    if (data.religion && data.religion !== existingMRN.religion) {
      mrn = await getNextMRN();
    }

    // Prepare update data
    const updateData = {
      ...data,
      ...(fileNumber !== existingMRN.fileNumber && { fileNumber }),
      ...(mrn !== existingMRN.mrn && { mrn }),
    };

    // Perform the update
    const updatedMRN = await mrnModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Handle file uploads if any
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
    fileService.deleteFilesByDocument("Mrns", id);

    return mrn;
  } catch (error) {
    throw new Error(`Error deleting MRN: ${error.message}`);
  }
};

const getByMRN = async (mrnNumber) => {
  try {
    const mrn = await mrnModel.findOne({ mrn: mrnNumber });
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
