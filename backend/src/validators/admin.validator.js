const { body, param } = require("express-validator");

const { PROVIDER_STATUS } = require("../constants/app.constants");

// UPDATE PROVIDER STATUS VALIDATION
const updateProviderStatusValidator = [
  // Validate provider ID from URL
  param("id").isMongoId().withMessage("Please provide a valid provider ID."),

  // Validate status from request body
  body("status")
    .isString()
    .withMessage("Status must be a string.")
    .bail()
    .trim()
    .isIn([PROVIDER_STATUS.APPROVED, PROVIDER_STATUS.REJECTED])
    .withMessage("Status must be either Approved or Rejected."),
];

module.exports = {
  updateProviderStatusValidator,
};
