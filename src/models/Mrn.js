const mongoose = require("mongoose");

const mrnSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    middleName: {
      type: String,
      // required: [true, "Please provide your middle name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your name"],
    },
    stateOfOrigin: {
      type: String,
      required: [true, "Please provide your state of origin"],
    },

    dateOfBirth: {
      type: String,
      required: [true, "Please provide your date of birth"],
    },

    religion: {
      type: String,
      required: [true, "Please provide religion name"],
      enum: ["M0", "M1", "M2"],
      select: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    mrn: {
      type: String,
      required: [true, "Please provide the MRN"],
      unique: true,
    },

    fileNumber: {
      type: String,
      required: [true, "Please provide the file Number"],
      unique: true,
    },

    nationality: {
      type: String,
      required: [true, "Please provide your Nationality"],
    },

    ethnicGroup: {
      type: String,
      required: [true, "Please provide your ethnicity"],
    },

    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      minlength: 11,
      select: true,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

mrnSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const mrn = mongoose.model("Mrn", mrnSchema);

module.exports = mrn;
