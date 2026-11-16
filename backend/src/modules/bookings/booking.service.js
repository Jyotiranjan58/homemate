const mongoose = require("mongoose");

const Booking = require("./booking.model");
const User = require("../users/user.model");
const Provider = require("../providers/provider.model");

const {
  PROVIDER_STATUS,
  BOOKING_STATUS,
} = require("../../constants/app.constants");

// CREATE CUSTOM ERROR
const createBookingError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// GET AUTHENTICATED USER
const getAuthenticatedUser = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createBookingError("Invalid user ID.", 401);
  }

  const user = await User.findById(userId).select("_id name email");

  if (!user) {
    throw createBookingError("User account not found.", 404);
  }

  return user;
};

const getAuthenticatedProvider = async (providerId) => {
  if (!mongoose.isValidObjectId(providerId)) {
    throw createBookingError("Invalid provider ID.", 401);
  }

  const provider = await Provider.findById(providerId).select(
    "_id name email providedServices status",
  );

  if (!provider) {
    throw createBookingError("Provider account not found.", 404);
  }

  if (provider.status !== PROVIDER_STATUS.APPROVED) {
    throw createBookingError("Your provider account is not approved.", 403);
  }

  return provider;
};

// CREATE A NEW BOOKING
const createBooking = async (userId, bookingData = {}) => {
  const { serviceName, price, date, time, address } = bookingData;

  // Validate required fields
  if (
    typeof serviceName !== "string" ||
    !serviceName.trim() ||
    typeof date !== "string" ||
    !date.trim() ||
    typeof time !== "string" ||
    !time.trim() ||
    typeof address !== "string" ||
    !address.trim()
  ) {
    throw createBookingError(
      "Please provide all required booking details.",
      400,
    );
  }

  // Validate price
  const normalizedPrice =
    typeof price === "number"
      ? price
      : typeof price === "string" && price.trim()
        ? Number(price)
        : NaN;

  if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
    throw createBookingError("Please provide a valid price.", 400);
  }

  // Get customer from authenticated JWT
  const user = await getAuthenticatedUser(userId);

  // Create booking using authenticated customer's email
  const newBooking = new Booking({
    userEmail: user.email,
    serviceName: serviceName.trim(),
    price: normalizedPrice,
    date: date.trim(),
    time: time.trim(),
    address: address.trim(),
  });

  const savedBooking = await newBooking.save();

  return savedBooking;
};

// GET CUSTOMER BOOKINGS
const getUserBookings = async (userId, requestedEmail) => {
  const user = await getAuthenticatedUser(userId);

  // Ensure requested email belongs to authenticated customer
  if (
    typeof requestedEmail !== "string" ||
    requestedEmail.trim().toLowerCase() !== user.email.toLowerCase()
  ) {
    throw createBookingError("You can only view your own bookings.", 403);
  }

  const bookings = await Booking.find({
    userEmail: user.email,
  }).sort({ createdAt: -1 });

  return bookings;
};

const getAvailableJobs = async (providerId) => {
  // Get authenticated and approved provider
  const provider = await getAuthenticatedProvider(providerId);

  // Find pending bookings matching provider services
  const availableJobs = await Booking.find({
    serviceName: {
      $in: provider.providedServices,
    },
    status: BOOKING_STATUS.PENDING,
  }).sort({
    createdAt: -1,
  });

  return availableJobs;
};

const acceptBooking = async (providerId, bookingId) => {
  // Validate booking ID
  if (!mongoose.isValidObjectId(bookingId)) {
    throw createBookingError("Invalid booking ID.", 400);
  }

  // Get authenticated and approved provider
  const provider = await getAuthenticatedProvider(providerId);

  // Accept only pending bookings matching provider services
  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      status: BOOKING_STATUS.PENDING,
      serviceName: {
        $in: provider.providedServices,
      },
    },
    {
      $set: {
        status: BOOKING_STATUS.ACCEPTED,
        providerEmail: provider.email,
        providerName: provider.name,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (updatedBooking) {
    return updatedBooking;
  }

  // Determine why the booking could not be accepted
  const existingBooking = await Booking.findById(bookingId);

  if (!existingBooking) {
    throw createBookingError("Booking not found.", 404);
  }

  if (existingBooking.status !== BOOKING_STATUS.PENDING) {
    throw createBookingError("This booking is no longer available.", 409);
  }

  throw createBookingError(
    "This booking does not match your provided services.",
    403,
  );
};

const getProviderBookings = async (providerId, requestedEmail) => {
  // Get authenticated and approved provider
  const provider = await getAuthenticatedProvider(providerId);

  // Verify requested email belongs to authenticated provider
  if (
    typeof requestedEmail !== "string" ||
    requestedEmail.trim().toLowerCase() !== provider.email.toLowerCase()
  ) {
    throw createBookingError("You can only view your own assigned jobs.", 403);
  }

  // Find bookings assigned to this provider
  const jobs = await Booking.find({
    providerEmail: provider.email,
  }).sort({
    updatedAt: -1,
  });

  return jobs;
};

const completeBooking = async (providerId, bookingId) => {
  // Validate booking ID
  if (!mongoose.isValidObjectId(bookingId)) {
    throw createBookingError("Invalid booking ID.", 400);
  }

  // Get authenticated and approved provider
  const provider = await getAuthenticatedProvider(providerId);

  // Update only bookings assigned to this provider
  // and currently in Accepted status
  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      providerEmail: provider.email,
      status: BOOKING_STATUS.ACCEPTED,
    },
    {
      $set: {
        status: BOOKING_STATUS.COMPLETED,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (updatedBooking) {
    return updatedBooking;
  }

  // Check why the update failed
  const existingBooking = await Booking.findById(bookingId);

  if (!existingBooking) {
    throw createBookingError("Booking not found.", 404);
  }

  // Verify booking ownership
  if (existingBooking.providerEmail !== provider.email) {
    throw createBookingError(
      "You are not authorized to complete this booking.",
      403,
    );
  }

  // Verify booking status
  throw createBookingError(
    "Only accepted bookings can be marked as completed.",
    409,
  );
};

const submitReview = async (userId, bookingId, reviewData = {}) => {
  // Validate booking ID
  if (!mongoose.isValidObjectId(bookingId)) {
    throw createBookingError("Invalid booking ID.", 400);
  }

  // Get authenticated customer
  const user = await getAuthenticatedUser(userId);

  const { rating, review } = reviewData;

  // Validate rating
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    throw createBookingError("Rating must be an integer between 1 and 5.", 400);
  }

  // Validate optional review text
  if (review !== undefined && review !== null && typeof review !== "string") {
    throw createBookingError("Review must be a valid string.", 400);
  }

  const normalizedReview =
    typeof review === "string" && review.trim() ? review.trim() : null;

  // Only the booking owner can review a completed booking
  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      userEmail: user.email,
      status: BOOKING_STATUS.COMPLETED,
      rating: null,
      review: null,
    },
    {
      $set: {
        rating,
        review: normalizedReview,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (updatedBooking) {
    return updatedBooking;
  }

  // Determine why the review could not be submitted
  const existingBooking = await Booking.findById(bookingId);

  if (!existingBooking) {
    throw createBookingError("Booking not found.", 404);
  }

  if (existingBooking.userEmail.toLowerCase() !== user.email.toLowerCase()) {
    throw createBookingError(
      "You are not authorized to review this booking.",
      403,
    );
  }

  if (existingBooking.status !== BOOKING_STATUS.COMPLETED) {
    throw createBookingError("Only completed bookings can be reviewed.", 409);
  }

  if (existingBooking.rating !== null || existingBooking.review !== null) {
    throw createBookingError(
      "You have already submitted a review for this booking.",
      409,
    );
  }

  throw createBookingError("Unable to submit review.", 409);
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
