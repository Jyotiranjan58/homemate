const {
  createBooking: createBookingService,
  getUserBookings: fetchUserBookings,
  getAvailableJobs: fetchAvailableJobs,
  acceptBooking: acceptBookingService,
  getProviderBookings: fetchProviderBookings,
  completeBooking: completeBookingService,
  submitReview: submitBookingReview,
} = require("./booking.service");

// CREATE BOOKING
const createBooking = async (req, res) => {
  const booking = await createBookingService(req.auth.id, req.body || {});

  return res.status(201).json({
    success: true,
    booking,
  });
};

// GET USER BOOKINGS
const getUserBookings = async (req, res) => {
  const bookings = await fetchUserBookings(req.auth.id, req.params.email);

  return res.status(200).json(bookings);
};

// GET AVAILABLE JOBS FOR PROVIDER
const getAvailableJobs = async (req, res) => {
  const jobs = await fetchAvailableJobs(req.auth.id);

  return res.status(200).json(jobs);
};

// ACCEPT BOOKING
const acceptBooking = async (req, res) => {
  const booking = await acceptBookingService(req.auth.id, req.params.id);

  return res.status(200).json({
    success: true,
    message: "Job accepted successfully!",
    booking,
  });
};

// GET PROVIDER BOOKINGS
const getProviderBookings = async (req, res) => {
  const jobs = await fetchProviderBookings(req.auth.id, req.params.email);

  return res.status(200).json(jobs);
};

// COMPLETE BOOKING
const completeBooking = async (req, res) => {
  const booking = await completeBookingService(req.auth.id, req.params.id);

  return res.status(200).json({
    success: true,
    message: "Job marked as completed!",
    booking,
  });
};

// SUBMIT REVIEW
const submitReview = async (req, res) => {
  const booking = await submitBookingReview(
    req.auth.id,
    req.params.id,
    req.body || {},
  );

  return res.status(200).json({
    success: true,
    message: "Review submitted!",
    booking,
  });
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
