const mongoose = require('mongoose')

const mrnSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
    },
    middleName: { type: String },
    lastName: { type: String, required: [true, 'Please provide your name'] },

    // Optional extras you asked for
    familyName: { type: String, trim: true },

    stateOfOrigin: {
      type: String,
      required: [true, 'Please provide your state of origin'],
      set: (v) => (typeof v === 'string' ? v.trim().toUpperCase() : v),
    },

    // Date with validation (your spec)
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide your date of birth'],
      validate: [
        {
          validator: (v) => v instanceof Date && !isNaN(v),
          message: 'Invalid date of birth',
        },
        {
          validator: (v) => v <= new Date(),
          message: 'Date of birth cannot be in the future',
        },
        {
          validator: (v) => {
            const age = (Date.now() - v.getTime()) / (365.25 * 24 * 3600 * 1000)
            return age < 130
          },
          message: 'Date of birth is out of range',
        },
      ],
    },

    religion: {
      type: String,
      required: [true, 'Please provide religion name'],
      enum: ['M0', 'M1', 'M2'],
      select: true,
    },

    address: { type: String, trim: true },
    residentialAddress: { type: String, trim: true },

    isDeleted: { type: Boolean, default: false },

    mrn: {
      type: String,
      required: [true, 'Please provide the MRN'],
      unique: true, // your service generates this
    },

    fileNumber: {
      type: String,
      required: [true, 'Please provide the file Number'],
      unique: true, // your service generates this
    },

    nationality: {
      type: String,
      required: [true, 'Please provide your Nationality'],
    },
    ethnicGroup: {
      type: String,
      required: [true, 'Please provide your ethnicity'],
    },

    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      minlength: 11,
      select: true,
      unique: true,
      trim: true,
    },

    // Sensitive, optional, unique if present
    bvn: {
      type: String,
      trim: true,
      select: false,
      validate: {
        validator: (v) => !v || /^\d{11}$/.test(v),
        message: 'BVN must be 11 digits',
      },
    },

    nin: {
      type: String,
      trim: true,
      select: false,
      validate: {
        validator: (v) => !v || /^\d{11}$/.test(v),
        message: 'NIN must be 11 digits',
      },
    },

    politicalParty: {
      type: String,
      trim: true,
      set: (v) => (typeof v === 'string' ? v.toUpperCase().trim() : v),
    },

    // Relative Number
    relativePhone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^\d{7,15}$/.test(v),
        message: 'Relative phone must be 7 to 15 digits',
      },
    },

    // Assistance Officer RN
    assistanceOfficerRN: { type: String, trim: true },

    // Changed to 'User' to match your service + populate usage
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

// Indexes
mrnSchema.index({ bvn: 1 }, { unique: true, sparse: true })
mrnSchema.index({ nin: 1 }, { unique: true, sparse: true })
// mrn and fileNumber already have unique indexes via the schema paths

// Output transforms
const commonTransform = (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString()

  if (
    returnedObject.dateOfBirth instanceof Date &&
    !isNaN(returnedObject.dateOfBirth)
  ) {
    returnedObject.dateOfBirth = returnedObject.dateOfBirth
      .toISOString()
      .slice(0, 10) // YYYY-MM-DD
  }

  delete returnedObject._id
  delete returnedObject.__v
  delete returnedObject.bvn
  delete returnedObject.nin
}

mrnSchema.set('toJSON', { virtuals: true, transform: commonTransform })
mrnSchema.set('toObject', { virtuals: true, transform: commonTransform })

const Mrn = mongoose.model('Mrn', mrnSchema)
module.exports = Mrn
