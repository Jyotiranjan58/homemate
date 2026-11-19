const { updateUserProfile } = require("./user.service");

// Update User Profile Controller
const updateProfile = async (req, res) => {
  const updatedUser = await updateUserProfile(req.auth.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
};

module.exports = {
  updateProfile,
};
