const express = require("express");

const { updateProfile } = require("./user.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { userProfileValidator } = require("../../validators/user.validator");

const { ROLES } = require("../../constants/app.constants");

const router = express.Router();

// UPDATE USER PROFILE
router.put(
  "/user/profile",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...userProfileValidator,
  validate,
  updateProfile,
);

module.exports = router;
