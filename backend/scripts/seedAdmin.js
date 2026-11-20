const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const { ROLES } = require("../src/constants/app.constants");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const Admin = require("../src/modules/admins/admin.model");
const seedAdmin = async () => {
  try {
    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    const mongoURI = MONGO_URI?.trim();
    const normalizedName = ADMIN_NAME?.trim();
    const normalizedEmail = ADMIN_EMAIL?.trim().toLowerCase();

    if (!mongoURI || !normalizedName || !normalizedEmail || !ADMIN_PASSWORD) {
      throw new Error("Missing required admin environment variables.");
    }

    if (!/^mongodb(\+srv)?:\/\//i.test(mongoURI)) {
      throw new Error("MONGO_URI must be a valid MongoDB connection string.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Please provide a valid admin email address.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must contain at least 12 characters.");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await Admin.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: ROLES.ADMIN,
    });

    console.log("Admin account created successfully.");
    console.log("Admin ID:", admin._id.toString());
    console.log("Admin Email:", admin.email);
  } catch (err) {
    console.error("Admin Seed Error:", err.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("MongoDB Disconnected");
    }
  }
};

seedAdmin();
