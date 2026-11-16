const express = require("express");

const { updateProfile } = require("./provider.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");

const { ROLES } = require("../../constants/app.constants");

const router = express.Router();

// Update Provider Profile
router.put(
  "/provider/profile",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  updateProfile,
);

module.exports = router;
