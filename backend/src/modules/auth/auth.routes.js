const express = require("express");

const { rateLimit } = require("express-rate-limit");

const {
  adminLogin,
  userSignup,
  userLogin,
  providerSignup,
  providerLogin,
} = require("./auth.controller");

const validate = require("../../middleware/validate.middleware");

const {
  adminLoginValidator,
  userSignupValidator,
  userLoginValidator,
  providerSignupValidator,
  providerLoginValidator,
} = require("../../validators/auth.validator");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Maximum 10 requests per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication requests. Please try again after 15 minutes.",
  },
});

// ADMIN LOGIN
router.post(
  "/admin/login",
  authLimiter,
  ...adminLoginValidator,
  validate,
  adminLogin,
);

// USER SIGNUP
router.post(
  "/user/signup",
  authLimiter,
  ...userSignupValidator,
  validate,
  userSignup,
);

// USER LOGIN
router.post(
  "/user/login",
  authLimiter,
  ...userLoginValidator,
  validate,
  userLogin,
);

// PROVIDER SIGNUP
router.post(
  "/provider/signup",
  authLimiter,
  ...providerSignupValidator,
  validate,
  providerSignup,
);

// PROVIDER LOGIN
router.post(
  "/provider/login",
  authLimiter,
  ...providerLoginValidator,
  validate,
  providerLogin,
);

module.exports = router;
