const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.trim() || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "50kb" }));

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/auth", require("./modules/users/user.routes"));
app.use("/api/auth", require("./modules/providers/provider.routes"));
app.use("/api/admin", require("./modules/admins/admin.routes"));
app.use("/api/bookings", require("./modules/bookings/booking.routes"));
app.use("/api/health", require("./modules/health/health.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
