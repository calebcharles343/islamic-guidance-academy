const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { type } = require("os");
const { string } = require("joi");

const verificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    mrn: {
      type: String,
      required: [true, "Please provide the MRN"],
    },
    fileNumber: {
      type: String,
      required: [true, "Please provide the file number"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Please provide your date of birth"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      minlength: 11,
      select: true,
    },
    ethnicGroup: {
      type: String,
      required: [true, "Please provide your ethnic group"],
    },
    stateOfOrigin: {
      type: String,
      required: [true, "Please provide your state of origin"],
    },
    residentialAddress: {
      type: String,
      required: [true, "Please provide your residential address"],
    },
    occupation: {
      type: String,
      required: [true, "Please provide your occupation"],
    },
    familyHouseName: {
      type: String,
      required: [true, "Please provide your family house name"],
    },
    fhrn: {
      type: String,
      required: [true, "Please provide the FHRN"],
    },
    nin: {
      type: String,
      required: [
        true,
        "Please provide your NIN (National Identification Number)",
      ],
      minlength: 11,
      select: true,
      unique: true,
    },
    bvn: {
      type: String,
      required: [true, "Please provide your BVN (Bank Verification Number)"],
      minlength: 11,
      select: true,
      unique: true,
    },

    photo: { type: String },
  },
  {
    timestamps: true,
    collection: "verifications",
  }
);

// Pre-save middleware to hash password
verificationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Middleware to set passwordChangedAt
verificationSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance methods for password comparison and password changes
verificationSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

verificationSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false; // False means NOT changed
};

verificationSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification;
