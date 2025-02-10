const Station = require("../models/StationModel");

const comparePasswords = require("../utils/comparePasswords");
const AppError = require("../utils/appError");

const stationLoginService = async (email, password, next) => {
  // Correct spelling
  const station = await Station.findOne({ email }).select("+password");

  console.log(station.password, "xxxx");

  if (!station || !(await comparePasswords(password, station.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  return station;
};

const getStationByIdService = async (stationId) => {
  const station = await Station.findById(stationId);
  return station;
};
const getAllStationsService = async () => {
  const stations = await Station.find();
  return stations;
};

const createStationService = async (stationData, next) => {
  // Check if the station already exists
  const stationExists = await Station.findOne({ email: stationData.email });

  if (stationExists) {
    return next(new AppError("Station already exists", 401)); // Exit early if station exists
  }

  // Create and save the new station
  const station = new Station(stationData);
  await station.save();

  return station; // Return the created station object
};

const updateStationService = async (stationId, updateData) => {
  const updatedStation = await Station.findByIdAndUpdate(
    stationId,
    updateData,
    { new: true }
  );
  return updatedStation;
};

const deleteStationService = async (stationId) => {
  const deletedStation = await Station.findByIdAndDelete(stationId);
  return deletedStation;
};

const updateStationPasswordService = async (stationId, newPassword) => {
  const station = await Station.findById(stationId);
  if (!station) {
    throw new Error("Station not found");
  }
  station.password = newPassword;
  station.passwordConfirm = newPassword;
  await station.save();
  return station;
};

module.exports = {
  stationLoginService, // Correct spelling
  getStationByIdService,
  getAllStationsService,
  createStationService,
  updateStationService,
  deleteStationService,
  updateStationPasswordService,
};
