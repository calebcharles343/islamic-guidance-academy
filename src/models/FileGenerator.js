const mongoose = require("mongoose");

const fileGeneratorSchema = new mongoose.Schema(
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

    religion: {
      type: String,
      required: [true, "Please provide religion name"],
      enum: ["M0", "M1", "M2"],
      select: true,
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
  },
  {
    timestamps: true,
  }
);

fileGeneratorSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const FileGenerator = mongoose.model("FileGenerator", fileGeneratorSchema);

module.exports = FileGenerator;
