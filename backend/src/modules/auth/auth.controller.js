const {
  loginAdmin,
  signupUser,
  loginUser,
  signupProvider,
  loginProvider,
} = require("./auth.service");

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const result = await loginAdmin(req.body);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      ...result,
    });
  } catch (err) {
    console.error("Admin Login Error:", err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to login admin.",
    });
  }
};

//User Signup
const userSignup = async (req, res) => {
  try {
    await signupUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (err) {
    console.error("User Signup Error:", err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to register user.",
    });
  }
};

//User Login
const userLogin = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (err) {
    console.error("User Login Error:", err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to login.",
    });
  }
};

//Provider Signup
const providerSignup = async (req, res) => {
  try {
    await signupProvider(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Provider registration successful. Your application is pending admin approval.",
    });
  } catch (err) {
    console.error("Provider Signup Error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to register provider.",
    });
  }
};

//Provider Login
const providerLogin = async (req, res) => {
  try {
    const result = await loginProvider(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (err) {
    console.error("Provider Login Error:", err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Unable to login.",
    });
  }
};

module.exports = {
  adminLogin,
  userSignup,
  userLogin,
  providerSignup,
  providerLogin,
};
