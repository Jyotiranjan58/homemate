const { body } = require("express-validator");

// PROVIDER PROFILE UPDATE VALIDATION
const providerProfileValidator = [
  // Validate name when provided
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),

  // Validate mobile when provided
  body("mobile")
    .optional()
    .custom((value) => {
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error("Mobile number must be a string or number.");
      }

      const mobile = String(value).trim();

      if (!/^[6-9]\d{9}$/.test(mobile)) {
        throw new Error("Please enter a valid 10-digit Indian mobile number.");
      }

      return true;
    }),

  // Validate city when provided
  body("city")
    .optional()
    .isString()
    .withMessage("City must be a string.")
    .bail()
    .trim()
    .custom((value) => {
      if (value.toLowerCase() !== "bhubaneswar") {
        throw new Error("HomeMate currently operates only in Bhubaneswar.");
      }

      return true;
    }),

  // Validate provided services when provided
  body("providedServices")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Please provide at least one service.")
    .bail()
    .custom((services) =>
      services.every(
        (service) => typeof service === "string" && service.trim().length > 0,
      ),
    )
    .withMessage("Please provide valid service names."),
];

module.exports = {
  providerProfileValidator,
};
