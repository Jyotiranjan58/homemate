const { updateProviderProfile } = require("./provider.service");

// Update Provider Profile Controller
const updateProfile = async (req, res) => {
  const updatedProvider = await updateProviderProfile(req.auth.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Provider profile updated successfully.",
    user: updatedProvider,
  });
};

module.exports = {
  updateProfile,
};
