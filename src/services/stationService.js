const Station = require("../models/StationModel");
const comparePasswords = require("../utils/comparePasswords");
const AppError = require("../utils/appError");

const sationLoginService = async (email, password, next) => {
  const station = await Station.findOne({ email }).select("+password");

  if (!station || !(await comparePasswords(password, station.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  return station;
};

const getStationById = async (stationId) => {
  const station = await Station.findById(stationId);
  return station;
};

const getAllStationsService = async () => {
  const stations = await Station.find();
  return stations;
};

const createStationService = async (stationData, next) => {
  try {
    // Check if the station already exists
    const stationExists = await Station.findOne({ email: stationData.email });

    if (stationExists) {
      return next(new AppError("Station already exists", 401)); // Assuming `AppError` is a custom error class
    }

    // Create and save the new station
    const station = new Station(stationData);
    await station.save();

    return station; // Return the created station object
  } catch (error) {
    // Pass error to the next middleware for centralized error handling
    return next(error);
  }
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

const updateStationPassword = async (stationId, newPassword) => {
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
  sationLoginService,
  getStationById,
  getAllStationsService,
  createStationService,
  updateStationService,
  deleteStationService,
  updateStationPassword,
};
