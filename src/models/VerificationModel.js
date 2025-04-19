const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    station_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    mrn: {
      type: String,
      required: [true, "Please provide the MRN"],
      unique: true,
    },
    fileNumber: {
      type: String,
      required: [true, "Please provide the file number"],
      unique: true,
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
      unique: true,
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
