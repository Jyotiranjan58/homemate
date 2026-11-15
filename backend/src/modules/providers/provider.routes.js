const express = require("express");

const { updateProfile } = require("./provider.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");

const router = express.Router();

// Update Provider Profile
router.put(
  "/provider/profile",
  authenticateToken,
  authorizeRoles("provider"),
  updateProfile,
);

module.exports = router;
