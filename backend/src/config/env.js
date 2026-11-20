const validateEnv = () => {
  const errors = [];

  // Validate MongoDB connection string
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    errors.push("MONGO_URI is required.");
  } else if (!/^mongodb(\+srv)?:\/\//i.test(mongoUri)) {
    errors.push("MONGO_URI must be a valid MongoDB connection string.");
  }

  // Validate JWT secret
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || !jwtSecret.trim()) {
    errors.push("JWT_SECRET is required.");
  } else if (Buffer.byteLength(jwtSecret, "utf8") < 32) {
    errors.push("JWT_SECRET must be at least 32 bytes long.");
  }

  // Validate PORT
  const portValue = process.env.PORT?.trim() || "5000";
  const port = Number(portValue);

  if (
    !/^\d+$/.test(portValue) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    errors.push("PORT must be a number between 1 and 65535.");
  }

  // Validate frontend URL
  const frontendUrl =
    process.env.FRONTEND_URL?.trim() || "http://localhost:5173";

  try {
    const parsedUrl = new URL(frontendUrl);

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      parsedUrl.origin !== frontendUrl
    ) {
      errors.push(
        "FRONTEND_URL must be a valid origin, e.g. http://localhost:5173.",
      );
    }
  } catch {
    errors.push(
      "FRONTEND_URL must be a valid origin, e.g. http://localhost:5173.",
    );
  }

  // Validate JWT expiration
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || "1h";

  if (!/^\d+(ms|s|m|h|d|w|y)$/i.test(jwtExpiresIn)) {
    errors.push(
      "JWT_EXPIRES_IN must be a valid duration such as 15m, 1h, or 7d.",
    );
  }

  // Stop application startup if configuration is invalid
  if (errors.length > 0) {
    throw new Error(
      `Environment configuration failed:\n- ${errors.join("\n- ")}`,
    );
  }

  return Object.freeze({
    PORT: port,
    JWT_EXPIRES_IN: jwtExpiresIn,
  });
};

module.exports = validateEnv;
