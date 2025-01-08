const express = require("express");
const {
  createVerification,
  getVerificationById,
  updateVerificationById,
  deleteVerificationById,
  getAllVerifications,
} = require("../controllers/verificationController");
// const restrictTo = require("../middleware/restrictTo");
// const protect = require("../middleware/protect");

const router = express.Router();

// router.use(protect);
router.route("/").get(getAllVerifications).post(createVerification);

router
  .route("/:id")
  .get(getVerificationById)
  .patch(updateVerificationById)
  .delete(deleteVerificationById);

module.exports = router;
