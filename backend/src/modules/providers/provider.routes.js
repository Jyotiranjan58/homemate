const express = require("express");

const { updateProfile } = require("./provider.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { ROLES } = require("../../constants/app.constants");

const {
  providerProfileValidator,
} = require("../../validators/provider.validator");

const router = express.Router();

// UPDATE PROVIDER PROFILE
router.put(
  "/provider/profile",
  authenticateToken,
  authorizeRoles(ROLES.PROVIDER),
  ...providerProfileValidator,
  validate,
  updateProfile,
);

module.exports = router;
