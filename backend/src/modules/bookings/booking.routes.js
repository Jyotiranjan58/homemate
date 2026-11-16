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

const router = express.Router();

//CREATE A NEW BOOKING (CUSTOMER)
router.post("/", authenticateToken, authorizeRoles("user"), createBooking);

//GET CUSTOMER BOOKINGS
router.get(
  "/user/:email",
  authenticateToken,
  authorizeRoles("user"),
  getUserBookings,
);

//GET AVAILABLE JOBS (PROVIDER)
router.post(
  "/available",
  authenticateToken,
  authorizeRoles("provider"),
  getAvailableJobs,
);

//ACCEPT A BOOKING (PROVIDER)
router.put(
  "/:id/accept",
  authenticateToken,
  authorizeRoles("provider"),
  acceptBooking,
);

//GET PROVIDER BOOKINGS
router.get(
  "/provider/:email",
  authenticateToken,
  authorizeRoles("provider"),
  getProviderBookings,
);

//MARK BOOKING AS COMPLETED (PROVIDER)
router.put(
  "/:id/complete",
  authenticateToken,
  authorizeRoles("provider"),
  completeBooking,
);

//SUBMIT A REVIEW (CUSTOMER)
router.put(
  "/:id/review",
  authenticateToken,
  authorizeRoles("user"),
  submitReview,
);

module.exports = router;
