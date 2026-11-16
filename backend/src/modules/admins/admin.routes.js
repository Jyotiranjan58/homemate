const express = require("express");

const {
  getPendingProviders,
  updateProviderStatus,
} = require("./admin.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));
router.get("/providers/pending", getPendingProviders);
router.put("/providers/:id/status", updateProviderStatus);

module.exports = router;
