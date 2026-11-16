const mongoose = require("mongoose");
const { ROLES, PROVIDER_STATUS } = require("../../constants/app.constants");

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true, select: false },
    city: { type: String, required: true },
    providedServices: [{ type: String, required: true }],
    status: {
      type: String,
      enum: Object.values(PROVIDER_STATUS),
      default: PROVIDER_STATUS.PENDING_REVIEW,
    },
    role: {
      type: String,
      enum: [ROLES.PROVIDER],
      default: ROLES.PROVIDER,
      immutable: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Provider", providerSchema);
