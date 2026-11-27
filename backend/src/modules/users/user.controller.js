const {
  getUserProfile,
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
  updateUserProfile,
  deactivateUserAccount,
} = require("./user.service");
const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// GET USER PROFILE
const getProfile = async (req, res) => {
  const user = await getUserProfile(req.auth.id);

  return sendSuccessResponse(
    res,
    200,
    "User profile retrieved successfully.",
    user,
  );
};

// ADD USER ADDRESS
const addAddress = async (req, res) => {
  const address = await addUserAddress(req.auth.id, req.body || {});

  return sendSuccessResponse(res, 201, "Address added successfully.", address);
};

// GET USER ADDRESSES
const getAddresses = async (req, res) => {
  const addresses = await getUserAddresses(req.auth.id);

  return sendSuccessResponse(
    res,
    200,
    "User addresses retrieved successfully.",
    {
      count: addresses.length,
      addresses,
    },
  );
};

//UPDATE USER ADDRESSES
const updateAddress = async (req, res) => {
  const address = await updateUserAddress(
    req.auth.id,
    req.params.addressId,
    req.body || {},
  );

  return sendSuccessResponse(
    res,
    200,
    "Address updated successfully.",
    address,
  );
};

const deleteAddress = async (req, res) => {
  const address = await deleteUserAddress(req.auth.id, req.params.addressId);

  return sendSuccessResponse(
    res,
    200,
    "Address deleted successfully.",
    address,
  );
};

const deactivateAccount = async (req, res) => {
  const result = await deactivateUserAccount(req.auth.id);

  return sendSuccessResponse(
    res,
    200,
    "Your account has been deactivated successfully.",
    result,
  );
};

// UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  const updatedUser = await updateUserProfile(req.auth.id, req.body);

  return sendSuccessResponse(
    res,
    200,
    "Profile updated successfully.",
    updatedUser,
  );
};

module.exports = {
  getProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  updateProfile,
  deactivateAccount,
};
