const express = require("express");
const router = express.Router();
const {
  stationLogin,
  stationLogout,
  getStation,
  getAllStations,
  createStation,
  updateStation,
  deleteStation,
  changeStationPassword,
} = require("../controllers/stationController");
// const { validateStation } = require("../middleware/inputValidator");

const protect = require("../middleware/protect");

router.post("/login", stationLogin);
router.post("/logout", stationLogout);
router.post("/signup", createStation);
router.get("/", protect, getAllStations);
router.get("/:id", protect, getStation);
router.patch("/update/:id", updateStation);
router.delete("/delete/:id", deleteStation);
router.patch("/updateStationPassword/:id", changeStationPassword);

module.exports = router;
