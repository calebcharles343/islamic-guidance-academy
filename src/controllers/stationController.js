const {
  getStationById,
  getAllStationsService,
  createStationService,
  updateStationService,
  deleteStationService,
  updateStationPassword,
  sationLoginService,
} = require("../services/stationService");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const comparePasswords = require("../utils/comparePasswords");
const createSendToken = require("../utils/createSendToken");
const handleResponse = require("../utils/handleResponse");

const sationLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleResponse(res, 400, "Please provide both email and password");
  }

  const station = await sationLoginService(email, password, next);

  if (!station) {
    return handleResponse(res, 401, "Invalid credentials");
  }

  const isPasswordCorrect = await comparePasswords(password, station.password);
  if (!isPasswordCorrect) {
    return handleResponse(res, 401, "Invalid credentials");
  }

  createSendToken(station, 200, res);
});

const sationLogout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return handleResponse(res, 200, "success");
});

const getStation = catchAsync(async (req, res, next) => {
  const station = await getStationById(req.params.id);
  if (!station) {
    return handleResponse(res, 404, "Station not found");
  }

  handleResponse(res, 200, "success", station);
});

const getAllStations = catchAsync(async (req, res, next) => {
  const stations = await getAllStationsService();
  handleResponse(res, 200, "success", stations);
});

const createStation = catchAsync(async (req, res, next) => {
  if (req.body.password !== req.body.passwordConfirm) {
    return handleResponse(res, 400, "Passwords do not match");
  }
  const newStation = await createStationService(req.body, next);
  handleResponse(res, 201, "Station Created", newStation);
});

const updateStation = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.newPassword || req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateStationPassword.",
        400
      )
    );
  }

  const updatedStation = await updateStationService(req.params.id, req.body);
  if (!updatedStation) {
    return handleResponse(res, 404, "Station not found");
  }

  handleResponse(res, 200, "Station updated", updatedStation);
});

const deleteStation = catchAsync(async (req, res, next) => {
  const deletedStation = await deleteStationService(req.params.id);
  if (!deletedStation) {
    return handleResponse(res, 404, "Station not found");
  }
  handleResponse(res, 200, "Station deleted");
});

const changeStationPassword = catchAsync(async (req, res, next) => {
  const stationId = req.params.id;
  const { newPassword } = req.body;

  const station = await getStationById(stationId);
  if (!station) {
    return handleResponse(res, 404, "Station not found");
  }
  const updatedStation = await updateStationPassword(stationId, newPassword);
  handleResponse(res, 200, "Station password updated", updatedStation);
});

module.exports = {
  sationLogin,
  sationLogout,
  getStation,
  getAllStations,
  createStation,
  updateStation,
  deleteStation,
  changeStationPassword,
};
