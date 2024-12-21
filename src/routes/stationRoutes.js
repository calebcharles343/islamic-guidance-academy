const express = require("express");
const router = express.Router();
const {
  sationLogin,
  sationLogout,
  getStation,
  getAllStations,
  createStation,
  updateStation,
  deleteStation,
  changeStationPassword,
} = require("../controllers/stationController");

router.post("/login", sationLogin);
router.post("/logout", sationLogout);
router.post("/signup", createStation);
router.get("/", getAllStations);
router.get("/:id", getStation);
router.patch("/update/:id", updateStation);
router.delete("/delete/:id", deleteStation);
router.patch("/updateStationPassword/:id", changeStationPassword);

module.exports = router;