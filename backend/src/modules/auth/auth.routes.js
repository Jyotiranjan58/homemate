const express = require("express");

const {
  adminLogin,
  userSignup,
  userLogin,
  providerSignup,
  providerLogin,
} = require("./auth.controller");

const router = express.Router();

// ADMIN, USER, PROVIDER Auth Routes
router.post("/admin/login", adminLogin);
router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
router.post("/provider/signup", providerSignup);
router.post("/provider/login", providerLogin);

module.exports = router;
