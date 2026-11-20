const { updateProviderProfile } = require("./provider.service");
const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// UPDATE PROVIDER PROFILE
const updateProfile = async (req, res) => {
  const updatedProvider = await updateProviderProfile(req.auth.id, req.body);

  return sendSuccessResponse(
    res,
    200,
    "Provider profile updated successfully.",
    updatedProvider,
  );
};

module.exports = {
  updateProfile,
};
