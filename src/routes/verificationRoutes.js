const express = require("express");
const {
  createVerification,
  getVerificationById,
  updateVerificationById,
  deleteVerificationById,
  getAllVerifications,
} = require("../controllers/verificationController");
// const protect = require("../middleware/protect");
// const restrictTo = require("../middleware/restrictTo");

const router = express.Router();

router.route("/").get(getAllVerifications).post(createVerification);

router
  .route("/:id")
  .get(getVerificationById)
  .patch(updateVerificationById)
  .delete(deleteVerificationById);

/*
  router
  .route("/")
  .get(protect, restrictTo("Admin"), getAllVerifications)
  .post(protect, createVerification);

router
  .route("/:id")
  .get(protect, getVerificationById)
  .patch(protect, restrictTo("Admin"), updateVerificationById)
  .delete(protect, restrictTo("Admin"), deleteVerificationById);
*/
module.exports = router;
