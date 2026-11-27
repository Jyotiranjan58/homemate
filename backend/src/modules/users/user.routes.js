const express = require("express");

const {
  getProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  deactivateAccount,
  updateProfile,
} = require("./user.controller");

const authenticateToken = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
  userProfileValidator,
  userAddressValidator,
  updateUserAddressValidator,
  deleteUserAddressValidator,
} = require("../../validators/user.validator");

const { ROLES } = require("../../constants/app.constants");

const router = express.Router();

// GET USER PROFILE
router.get(
  "/user/profile",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  getProfile,
);

// UPDATE USER PROFILE
router.put(
  "/user/profile",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...userProfileValidator,
  validate,
  updateProfile,
);

// DEACTIVATE USER ACCOUNT
router.patch(
  "/user/deactivate",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  deactivateAccount,
);
s;
// ADD USER ADDRESS
router.post(
  "/user/addresses",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...userAddressValidator,
  validate,
  addAddress,
);

// GET USER ADDRESSES
router.get(
  "/user/addresses",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  getAddresses,
);

// UPDATE USER ADDRESS
router.patch(
  "/user/addresses/:addressId",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...updateUserAddressValidator,
  validate,
  updateAddress,
);

// DELETE USER ADDRESS
router.delete(
  "/user/addresses/:addressId",
  authenticateToken,
  authorizeRoles(ROLES.USER),
  ...deleteUserAddressValidator,
  validate,
  deleteAddress,
);

module.exports = router;
