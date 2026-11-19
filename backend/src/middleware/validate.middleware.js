const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  // If there are no errors, continue to the controller
  if (errors.isEmpty()) {
    return next();
  }

  // Combine all validation errors into one message
  const message = errors
    .array()
    .map((error) => `${error.path}: ${error.msg}`)
    .join(", ");

  const validationError = new Error(message);
  validationError.statusCode = 400;

  return next(validationError);
};

module.exports = validate;
