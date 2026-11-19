const {
  loginAdmin,
  signupUser,
  loginUser,
  signupProvider,
  loginProvider,
} = require("./auth.service");

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  const result = await loginAdmin(req.body);

  return res.status(200).json({
    success: true,
    message: "Admin login successful.",
    ...result,
  });
};

// USER SIGNUP
const userSignup = async (req, res) => {
  await signupUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
  });
};

// USER LOGIN
const userLogin = async (req, res) => {
  const result = await loginUser(req.body);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    ...result,
  });
};

// PROVIDER SIGNUP
const providerSignup = async (req, res) => {
  await signupProvider(req.body);

  return res.status(201).json({
    success: true,
    message:
      "Provider registration successful. Your application is pending admin approval.",
  });
};

// PROVIDER LOGIN
const providerLogin = async (req, res) => {
  const result = await loginProvider(req.body);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    ...result,
  });
};

module.exports = {
  adminLogin,
  userSignup,
  userLogin,
  providerSignup,
  providerLogin,
};
