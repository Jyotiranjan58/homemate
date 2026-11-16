const mongoose = require("mongoose");
const { ROLES } = require("../../constants/app.constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [ROLES.USER],
      default: ROLES.USER,
      immutable: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
