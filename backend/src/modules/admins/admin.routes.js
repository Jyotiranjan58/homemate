const express = require("express");

const {
  getPendingProviders,
  updateProviderStatus,
} = require("./admin.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const { ROLES } = require("../../constants/app.constants");

const {
  updateProviderStatusValidator,
} = require("../../validators/admin.validator");

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken, authorizeRoles(ROLES.ADMIN));

// GET PENDING PROVIDERS
router.get("/providers/pending", getPendingProviders);

// APPROVE OR REJECT PROVIDER
router.put(
  "/providers/:id/status",
  ...updateProviderStatusValidator,
  validate,
  updateProviderStatus,
);

module.exports = router;
