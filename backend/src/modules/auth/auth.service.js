const bcrypt = require("bcrypt");

const Admin = require("../admins/admin.model");
const User = require("../users/user.model");
const Provider = require("../providers/provider.model");
const generateAuthToken = require("../../utils/generateAuthToken");

// Helper for authentication errors
const createAuthError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ADMIN LOGIN SERVICE
const loginAdmin = async (credentials = {}) => {
  const { email, password } = credentials;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw createAuthError("Email and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!admin) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const token = generateAuthToken(admin._id, admin.role);

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

//User Signup Service
const signupUser = async (userData = {}) => {
  const { name, email, mobile, password } = userData;

  if (!name || !email || !mobile || !password) {
    throw createAuthError("Please fill all required fields.", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createAuthError("Email already in use.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    mobile,
    password: hashedPassword,
  });

  await newUser.save();
};

//User Login Service
const loginUser = async (credentials = {}) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw createAuthError("Email and password are required.", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const token = generateAuthToken(user._id, "user");

  const userData = user.toObject();
  delete userData.password;

  return {
    token,
    user: userData,
  };
};

const signupProvider = async (providerData = {}) => {
  const { name, email, mobile, password, city, providedServices } =
    providerData;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    mobile === undefined ||
    mobile === null ||
    typeof password !== "string" ||
    !password ||
    typeof city !== "string" ||
    !city.trim() ||
    providedServices === undefined
  ) {
    throw createAuthError("Please fill all required fields.", 400);
  }
  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw createAuthError("Please enter a valid email address.", 400);
  }

  const normalizedMobile = String(mobile).trim();

  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    throw createAuthError(
      "Please enter a valid 10-digit Indian mobile number.",
      400,
    );
  }

  if (password.length < 8) {
    throw createAuthError("Password must contain at least 8 characters.", 400);
  }

  if (
    !Array.isArray(providedServices) ||
    providedServices.length === 0 ||
    !providedServices.every(
      (service) => typeof service === "string" && service.trim().length > 0,
    )
  ) {
    throw createAuthError("Please select at least one valid service.", 400);
  }

  const normalizedServices = [
    ...new Set(providedServices.map((service) => service.trim())),
  ];

  if (city.trim().toLowerCase() !== "bhubaneswar") {
    throw createAuthError(
      "HomeMate currently operates only in Bhubaneswar.",
      400,
    );
  }

  const existingProvider = await Provider.findOne({
    email: normalizedEmail,
  });

  if (existingProvider) {
    throw createAuthError("An account with this email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newProvider = new Provider({
    name: name.trim(),
    email: normalizedEmail,
    mobile: normalizedMobile,
    password: hashedPassword,
    city: "Bhubaneswar",
    providedServices: normalizedServices,
  });

  await newProvider.save();
};

const loginProvider = async (credentials = {}) => {
  const { email, password } = credentials;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw createAuthError("Email and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const provider = await Provider.findOne({
    email: normalizedEmail,
  });

  if (!provider) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, provider.password);

  if (!isMatch) {
    throw createAuthError("Invalid email or password.", 401);
  }

  if (provider.status !== "Approved") {
    throw createAuthError("Your account is not approved yet.", 403);
  }

  const token = generateAuthToken(provider._id, "provider");

  const providerData = provider.toObject();
  delete providerData.password;

  return {
    token,
    user: providerData,
  };
};

module.exports = {
  loginAdmin,
  signupUser,
  loginUser,
  signupProvider,
  loginProvider,
};
