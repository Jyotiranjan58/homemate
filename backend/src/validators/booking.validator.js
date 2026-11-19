const { body, param } = require("express-validator");

// CREATE BOOKING VALIDATION
const createBookingValidator = [
  body("serviceName")
    .isString()
    .withMessage("Service name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Service name is required."),

  body("price")
    .custom((value) => {
      const normalizedPrice =
        typeof value === "number"
          ? value
          : typeof value === "string" && value.trim()
            ? Number(value)
            : NaN;

      return Number.isFinite(normalizedPrice) && normalizedPrice >= 0;
    })
    .withMessage("Please provide a valid price."),

  body("date")
    .isString()
    .withMessage("Date must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Date is required."),

  body("time")
    .isString()
    .withMessage("Time must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Time is required."),

  body("address")
    .isString()
    .withMessage("Address must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Address is required."),
];

// BOOKING ID VALIDATION
const bookingIdValidation = () => {
  return param("id")
    .isMongoId()
    .withMessage("Please provide a valid booking ID.");
};

// ACCEPT BOOKING VALIDATION
const acceptBookingValidator = [bookingIdValidation()];

// COMPLETE BOOKING VALIDATION
const completeBookingValidator = [bookingIdValidation()];

// SUBMIT REVIEW VALIDATION
const submitReviewValidator = [
  bookingIdValidation(),

  body("rating")
    .custom((value) => {
      return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 5
      );
    })
    .withMessage("Rating must be an integer between 1 and 5."),

  body("review")
    .optional({ values: "null" })
    .isString()
    .withMessage("Review must be a valid string.")
    .bail()
    .trim(),
];

// USER BOOKING HISTORY VALIDATION
const getUserBookingsValidator = [
  param("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

// PROVIDER BOOKING HISTORY VALIDATION
const getProviderBookingsValidator = [
  param("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address."),
];

module.exports = {
  createBookingValidator,
  acceptBookingValidator,
  completeBookingValidator,
  submitReviewValidator,
  getUserBookingsValidator,
  getProviderBookingsValidator,
};
