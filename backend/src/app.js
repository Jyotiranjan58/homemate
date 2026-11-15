const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/auth", require("./modules/users/user.routes"));
app.use("/api/auth", require("./modules/providers/provider.routes"));
app.use("/api/admin", require("./modules/admins/admin.routes"));
app.use("/api/bookings", require("./modules/bookings/booking.routes"));

module.exports = app;
