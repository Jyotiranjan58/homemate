const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../../constants/app.constants");

const bookingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    providerEmail: { type: String, default: null },
    providerName: { type: String, default: null },

    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
