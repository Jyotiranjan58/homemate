const Provider = require("./provider.model");

// Update Provider Profile Service
const updateProviderProfile = async (providerId, profileData = {}) => {
  const { name, mobile, city, providedServices } = profileData;

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (mobile !== undefined) {
    updates.mobile = String(mobile).trim();
  }

  if (city !== undefined) {
    if (
      typeof city !== "string" ||
      city.trim().toLowerCase() !== "bhubaneswar"
    ) {
      const error = new Error(
        "HomeMate currently operates only in Bhubaneswar.",
      );

      error.statusCode = 400;
      throw error;
    }

    updates.city = "Bhubaneswar";
  }

  if (providedServices !== undefined) {
    updates.providedServices = providedServices.map((service) =>
      service.trim(),
    );
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error("No profile information provided.");

    error.statusCode = 400;
    throw error;
  }

  const updatedProvider = await Provider.findByIdAndUpdate(
    providerId,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!updatedProvider) {
    const error = new Error("Provider not found.");
    error.statusCode = 404;
    throw error;
  }

  return updatedProvider;
};

module.exports = {
  updateProviderProfile,
};
