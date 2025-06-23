const express = require("express");
const router = express.Router();
const mrnController = require("../controllers/mrnController");
const { upload } = require("../controllers/fileController");

// Create a new FileGenerator
router.post("/", upload.array("files", 10), mrnController.createMRN);

// Get all FileGenerators
router.get("/", mrnController.getAllMRNs);

// Get a single FileGenerator by ID
router.get("/:id", mrnController.getMRNById);

// Update a FileGenerator by ID
router.put("/:id", upload.array("files", 10), mrnController.updateMRN);

// Delete a FileGenerator by ID
router.delete("/:id", mrnController.deleteMRN);

// Get a FileGenerator by MRN
router.get("/mrn/:mrn", mrnController.getByMRN);

module.exports = router;
