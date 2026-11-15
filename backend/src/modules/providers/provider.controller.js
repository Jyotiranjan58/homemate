const { updateProviderProfile } = require("./provider.service");

// Update Provider Profile Controller
const updateProfile = async (req, res) => {
  try {
    const updatedProvider = await updateProviderProfile(req.auth.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Provider profile updated successfully.",
      user: updatedProvider,
    });
  } catch (err) {
    console.error("Provider Profile Update Error:", err);

    const isValidationError =
      err.name === "ValidationError" || err.name === "CastError";

    const statusCode = err.statusCode || (isValidationError ? 400 : 500);

    return res.status(statusCode).json({
      success: false,
      message:
        err.statusCode || isValidationError
          ? err.message
          : "Unable to update provider profile.",
    });
  }
};

module.exports = {
  updateProfile,
};
