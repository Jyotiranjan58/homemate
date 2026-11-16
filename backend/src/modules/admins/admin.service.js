const mongoose = require("mongoose");
const Provider = require("../providers/provider.model");
const { PROVIDER_STATUS } = require("../../constants/app.constants");

// Helper for creating errors
const createAdminError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// GET ALL PENDING PROVIDERS
const getPendingProviders = async () => {
  const pendingProviders = await Provider.find({
    status: PROVIDER_STATUS.PENDING_REVIEW,
  })
    .select("-password")
    .sort({ createdAt: -1 });

  return pendingProviders;
};

const updateProviderStatus = async (providerId, status) => {
  // Validate status
  if (![PROVIDER_STATUS.APPROVED, PROVIDER_STATUS.REJECTED].includes(status)) {
    throw createAdminError("Status must be either Approved or Rejected.", 400);
  }

  if (!mongoose.isValidObjectId(providerId)) {
    throw createAdminError("Invalid provider ID.", 400);
  }

  // Update only pending applications
  const updatedProvider = await Provider.findOneAndUpdate(
    {
      _id: providerId,
      status: PROVIDER_STATUS.PENDING_REVIEW,
    },
    {
      $set: { status },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (updatedProvider) {
    return updatedProvider;
  }
  const existingProvider =
    await Provider.findById(providerId).select("_id status");

  if (!existingProvider) {
    throw createAdminError("Provider not found.", 404);
  }

  throw createAdminError(
    "This provider application has already been reviewed.",
    409,
  );
};

module.exports = {
  getPendingProviders,
  updateProviderStatus,
};
