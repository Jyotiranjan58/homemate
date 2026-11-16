const errorHandler = (err, req, res, next) => {
  // If the response has already started, let Express handle it.
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

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

  // Log unexpected server errors
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
