const mongoose = require("mongoose");
const { ROLES } = require("../../constants/app.constants");

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },

  addressLine1: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },

  addressLine2: {
    type: String,
    trim: true,
    default: "",
    maxlength: 120,
  },

  area: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },

  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },

  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },

  pincode: {
    type: String,
    required: true,
    match: /^[1-9]\d{5}$/,
  },

  landmark: {
    type: String,
    trim: true,
    default: "",
    maxlength: 100,
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [ROLES.USER],
      default: ROLES.USER,
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
