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
const { ROLES } = require("../../constants/app.constants");

const router = express.Router();

//CREATE A NEW BOOKING (CUSTOMER)
router.post("/", authenticateToken, authorizeRoles(ROLES.USER), createBooking);

router.get(
  "/user/:email",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  getUserBookings,
);

//GET AVAILABLE JOBS (PROVIDER)
router.post(
  "/available",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  getAvailableJobs,
);

//ACCEPT A BOOKING (PROVIDER)
router.put(
  "/:id/accept",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  acceptBooking,
);

//GET PROVIDER BOOKINGS
router.get(
  "/provider/:email",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  getProviderBookings,
);

//MARK BOOKING AS COMPLETED (PROVIDER)
router.put(
  "/:id/complete",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  completeBooking,
);

//SUBMIT A REVIEW (CUSTOMER)
router.put(
  "/:id/review",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  submitReview,
);

module.exports = router;
