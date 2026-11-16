const errorHandler = (err, req, res, next) => {
  // If the response has already started, let Express handle it.
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = Number(err.statusCode || err.status || 500);
  let message = err.message || "Internal Server Error";

  // Make sure the status code is a valid client/server error code.
  if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID.";
  }

  // Duplicate MongoDB field
  if (err.code === 11000) {
    statusCode = 409;
    message = "This record already exists.";
  }

  // Invalid JSON request body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON request body.";
  }

  // Hide internal error details from clients.
  if (statusCode >= 500) {
    console.error("Server Error:", err);
    message = "Internal Server Error";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
