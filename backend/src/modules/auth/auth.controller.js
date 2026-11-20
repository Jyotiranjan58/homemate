const {
  loginAdmin,
  signupUser,
  loginUser,
  signupProvider,
  loginProvider,
} = require("./auth.service");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  const result = await loginAdmin(req.body);

  return sendSuccessResponse(res, 200, "Admin login successful.", result);
};

// USER SIGNUP
const userSignup = async (req, res) => {
  await signupUser(req.body);

  return sendSuccessResponse(res, 201, "User registered successfully.");
};

// USER LOGIN
const userLogin = async (req, res) => {
  const result = await loginUser(req.body);

  return sendSuccessResponse(res, 200, "Login successful.", result);
};

// PROVIDER SIGNUP
const providerSignup = async (req, res) => {
  await signupProvider(req.body);

  return sendSuccessResponse(
    res,
    201,
    "Provider registration successful. Your application is pending admin approval.",
  );
};

// PROVIDER LOGIN
const providerLogin = async (req, res) => {
  const result = await loginProvider(req.body);

  return sendSuccessResponse(res, 200, "Login successful.", result);
};

module.exports = {
  adminLogin,
  userSignup,
  userLogin,
  providerSignup,
  providerLogin,
};
