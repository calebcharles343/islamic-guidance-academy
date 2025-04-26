const express = require("express");
const router = express.Router();
const fileGeneratorController = require("../controllers/fileGeneratorController");

// Create a new FileGenerator
router.post("/", fileGeneratorController.createFile);

// Get all FileGenerators
router.get("/", fileGeneratorController.getAllFiles);

// Get a single FileGenerator by ID
router.get("/:id", fileGeneratorController.getFileById);

// Update a FileGenerator by ID
router.put("/:id", fileGeneratorController.updateFile);

// Delete a FileGenerator by ID
router.delete("/:id", fileGeneratorController.deleteFile);

// Get a FileGenerator by MRN
router.get("/mrn/:mrn", fileGeneratorController.getFileByMrn);

module.exports = router;
