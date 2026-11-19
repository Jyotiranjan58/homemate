const express = require("express");

const {
  createBooking,
  getUserBookings,
  getAvailableJobs,
  acceptBooking,
  getProviderBookings,
  completeBooking,
  submitReview,
} = require("./booking.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { ROLES } = require("../../constants/app.constants");

const {
  createBookingValidator,
  acceptBookingValidator,
  completeBookingValidator,
  submitReviewValidator,
  getUserBookingsValidator,
  getProviderBookingsValidator,
} = require("../../validators/booking.validator");

const router = express.Router();

// CREATE A NEW BOOKING (CUSTOMER)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...createBookingValidator,
  validate,
  createBooking,
);

// GET USER BOOKINGS
router.get(
  "/user/:email",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...getUserBookingsValidator,
  validate,
  getUserBookings,
);

// GET AVAILABLE JOBS (PROVIDER)
router.post(
  "/available",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  getAvailableJobs,
);

// ACCEPT A BOOKING (PROVIDER)
router.put(
  "/:id/accept",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  ...acceptBookingValidator,
  validate,
  acceptBooking,
);

// GET PROVIDER BOOKINGS
router.get(
  "/provider/:email",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  ...getProviderBookingsValidator,
  validate,
  getProviderBookings,
);

// MARK BOOKING AS COMPLETED (PROVIDER)
router.put(
  "/:id/complete",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  ...completeBookingValidator,
  validate,
  completeBooking,
);

// SUBMIT A REVIEW (CUSTOMER)
router.put(
  "/:id/review",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...submitReviewValidator,
  validate,
  submitReview,
);

module.exports = router;
