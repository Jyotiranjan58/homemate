const express = require("express");

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

// ADMIN LOGIN
router.post("/admin/login", ...adminLoginValidator, validate, adminLogin);

// USER SIGNUP
router.post("/user/signup", ...userSignupValidator, validate, userSignup);

// USER LOGIN
router.post("/user/login", ...userLoginValidator, validate, userLogin);

// PROVIDER SIGNUP
router.post(
  "/provider/signup",
  ...providerSignupValidator,
  validate,
  providerSignup,
);

// PROVIDER LOGIN
router.post(
  "/provider/login",
  ...providerLoginValidator,
  validate,
  providerLogin,
);

module.exports = router;
