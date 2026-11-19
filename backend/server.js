require("dotenv").config();

const validateEnv = require("./src/config/env");

// Validate environment configuration
let envConfig;

try {
  envConfig = validateEnv();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = envConfig.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HomeMate server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start HomeMate server:", error.message);
    process.exit(1);
  }
};

startServer();
