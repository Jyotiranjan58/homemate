const express = require("express");

const { updateProfile } = require("./user.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");

const router = express.Router();

//Update User Profile
router.put(
  "/user/profile",
  authenticateToken,
  authorizeRoles("user"),
  updateProfile,
);

module.exports = router;
