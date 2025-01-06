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

module.exports = router;
