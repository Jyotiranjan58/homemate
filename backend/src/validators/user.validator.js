const { body } = require("express-validator");

// USER PROFILE UPDATE VALIDATION
const userProfileValidator = [
  // Validate name only when provided
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),

  // Validate mobile only when provided
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
];

module.exports = {
  userProfileValidator,
};
