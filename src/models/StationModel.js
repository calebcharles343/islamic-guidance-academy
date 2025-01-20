"use strict";
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the station name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    userName: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    station: {
      type: String,
      enum: ["NGKW-1446-2401", "NGOY-1446-2401"],
      select: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      minlength: 11,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    collection: "stations",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

stationSchema.virtual("verifications", {
  ref: "Verification",
  localField: "_id",
  foreignField: "station_id",
});

stationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

stationSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

stationSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

stationSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false; // False means NOT changed
};

stationSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
