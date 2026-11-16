const {
  createBooking: createBookingService,
  getUserBookings: fetchUserBookings,
  getAvailableJobs: fetchAvailableJobs,
  acceptBooking: acceptBookingService,
  getProviderBookings: fetchProviderBookings,
  completeBooking: completeBookingService,
  submitReview: submitBookingReview,
} = require("./booking.service");

const handleControllerError = (res, err, context, fallbackMessage) => {
  console.error(`${context}:`, err);

  const isValidationError =
    err.name === "ValidationError" || err.name === "CastError";

  const statusCode = err.statusCode || (isValidationError ? 400 : 500);

  const message =
    err.statusCode || isValidationError ? err.message : fallbackMessage;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const createBooking = async (req, res) => {
  try {
    const booking = await createBookingService(req.auth.id, req.body || {});

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Create Booking Error",
      "Unable to create booking.",
    );
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await fetchUserBookings(req.auth.id, req.params.email);

    return res.status(200).json(bookings);
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Get User Bookings Error",
      "Unable to fetch user bookings.",
    );
  }
};

const getAvailableJobs = async (req, res) => {
  try {
    const jobs = await fetchAvailableJobs(req.auth.id);

    return res.status(200).json(jobs);
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Get Available Jobs Error",
      "Unable to fetch available jobs.",
    );
  }
};

const acceptBooking = async (req, res) => {
  try {
    const booking = await acceptBookingService(req.auth.id, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job accepted successfully!",
      booking,
    });
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Accept Booking Error",
      "Unable to accept booking.",
    );
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const jobs = await fetchProviderBookings(req.auth.id, req.params.email);

    return res.status(200).json(jobs);
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Get Provider Bookings Error",
      "Unable to fetch provider bookings.",
    );
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await completeBookingService(req.auth.id, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job marked as completed!",
      booking,
    });
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Complete Booking Error",
      "Unable to complete booking.",
    );
  }
};

const submitReview = async (req, res) => {
  try {
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
  } catch (err) {
    return handleControllerError(
      res,
      err,
      "Submit Review Error",
      "Unable to submit review.",
    );
  }
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
