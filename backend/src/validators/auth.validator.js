const { body } = require("express-validator");

// Common email validation
const emailValidation = () => {
  return body("email")
    .isString()
    .withMessage("Email must be a string.")
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email address.");
};

// Common password validation for login
const loginPasswordValidation = () => {
  return body("password")
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .notEmpty()
    .withMessage("Password is required.");
};

// Password validation for signup
const signupPasswordValidation = () => {
  return body("password")
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters.");
};

// ADMIN LOGIN VALIDATION
const adminLoginValidator = [emailValidation(), loginPasswordValidation()];

// USER SIGNUP VALIDATION
const userSignupValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  emailValidation(),

  body("mobile")
    .custom((value) => {
      const mobile = String(value).trim();

      return (
        (typeof value === "string" || typeof value === "number") &&
        /^[6-9]\d{9}$/.test(mobile)
      );
    })
    .withMessage("Please enter a valid 10-digit Indian mobile number."),

  signupPasswordValidation(),
];

// USER LOGIN VALIDATION
const userLoginValidator = [emailValidation(), loginPasswordValidation()];

// PROVIDER SIGNUP VALIDATION
const providerSignupValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  emailValidation(),

  body("mobile")
    .custom((value) => {
      const mobile = String(value).trim();

      return (
        (typeof value === "string" || typeof value === "number") &&
        /^[6-9]\d{9}$/.test(mobile)
      );
    })
    .withMessage("Please enter a valid 10-digit Indian mobile number."),

  signupPasswordValidation(),

  body("city")
    .isString()
    .withMessage("City must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("providedServices")
    .isArray({ min: 1 })
    .withMessage("Please select at least one service.")
    .bail()
    .custom((services) =>
      services.every(
        (service) => typeof service === "string" && service.trim().length > 0,
      ),
    )
    .withMessage("Please provide valid service names."),
];

// PROVIDER LOGIN VALIDATION
const providerLoginValidator = [emailValidation(), loginPasswordValidation()];

module.exports = {
  adminLoginValidator,
  userSignupValidator,
  userLoginValidator,
  providerSignupValidator,
  providerLoginValidator,
};
