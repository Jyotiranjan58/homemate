const { updateUserProfile } = require("./user.service");
const sendSuccessResponse = require("../../utils/sendSuccessResponse");

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
  updateProfile,
};
