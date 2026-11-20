const {
  createBooking: createBookingService,
  getUserBookings: fetchUserBookings,
  getAvailableJobs: fetchAvailableJobs,
  acceptBooking: acceptBookingService,
  getProviderBookings: fetchProviderBookings,
  completeBooking: completeBookingService,
  submitReview: submitBookingReview,
} = require("./booking.service");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// CREATE BOOKING
const createBooking = async (req, res) => {
  const booking = await createBookingService(req.auth.id, req.body || {});

  return sendSuccessResponse(
    res,
    201,
    "Booking created successfully.",
    booking,
  );
};

// GET USER BOOKINGS
const getUserBookings = async (req, res) => {
  const bookings = await fetchUserBookings(req.auth.id, req.params.email);

  return sendSuccessResponse(
    res,
    200,
    "User bookings retrieved successfully.",
    {
      count: bookings.length,
      bookings,
    },
  );
};

// GET AVAILABLE JOBS FOR PROVIDER
const getAvailableJobs = async (req, res) => {
  const jobs = await fetchAvailableJobs(req.auth.id);

  return sendSuccessResponse(
    res,
    200,
    "Available jobs retrieved successfully.",
    {
      count: jobs.length,
      jobs,
    },
  );
};

// ACCEPT BOOKING
const acceptBooking = async (req, res) => {
  const booking = await acceptBookingService(req.auth.id, req.params.id);

  return sendSuccessResponse(res, 200, "Job accepted successfully!", booking);
};

// GET PROVIDER BOOKINGS
const getProviderBookings = async (req, res) => {
  const jobs = await fetchProviderBookings(req.auth.id, req.params.email);

  return sendSuccessResponse(
    res,
    200,
    "Provider bookings retrieved successfully.",
    {
      count: jobs.length,
      bookings: jobs,
    },
  );
};

// COMPLETE BOOKING
const completeBooking = async (req, res) => {
  const booking = await completeBookingService(req.auth.id, req.params.id);

  return sendSuccessResponse(res, 200, "Job marked as completed!", booking);
};

// SUBMIT REVIEW
const submitReview = async (req, res) => {
  const booking = await submitBookingReview(
    req.auth.id,
    req.params.id,
    req.body || {},
  );

  return sendSuccessResponse(res, 200, "Review submitted!", booking);
};

module.exports = {
  createBooking,
  getUserBookings,
  getAvailableJobs,
  acceptBooking,
  getProviderBookings,
  completeBooking,
  submitReview,
};
