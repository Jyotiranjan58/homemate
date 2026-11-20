const jwt = require("jsonwebtoken");

const generateAuthToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: id.toString(),
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN?.trim() || "1h",
      algorithm: "HS256",
    },
  );
};

module.exports = generateAuthToken;
