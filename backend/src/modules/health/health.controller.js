const mongoose = require("mongoose");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// CHECK SERVER AND DATABASE HEALTH
const getHealth = (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  const healthData = {
    server: "running",
    database: isDatabaseConnected ? "connected" : "disconnected",
  };

  if (!isDatabaseConnected) {
    return res.status(503).json({
      success: false,
      message: "HomeMate service is currently unavailable.",
      data: healthData,
    });
  }

  return sendSuccessResponse(res, 200, "HomeMate API is healthy.", healthData);
};

module.exports = {
  getHealth,
};
