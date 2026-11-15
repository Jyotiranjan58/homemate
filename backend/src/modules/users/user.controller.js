const { updateUserProfile } = require("./user.service");

// Update User Profile Controller
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(req.auth.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("User Profile Update Error:", err);

    const isValidationError =
      err.name === "ValidationError" || err.name === "CastError";

    const statusCode = err.statusCode || (isValidationError ? 400 : 500);

    return res.status(statusCode).json({
      success: false,
      message:
        err.statusCode || isValidationError
          ? err.message
          : "Unable to update user profile.",
    });
  }
};

module.exports = {
  updateProfile,
};
