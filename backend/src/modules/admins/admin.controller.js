const {
  getPendingProviders: fetchPendingProviders,
  updateProviderStatus: changeProviderStatus,
} = require("./admin.service");

const sendSuccessResponse = require("../../utils/sendSuccessResponse");

// GET ALL PENDING PROVIDERS
const getPendingProviders = async (req, res) => {
  const providers = await fetchPendingProviders();

  return sendSuccessResponse(
    res,
    200,
    "Pending providers retrieved successfully.",
    {
      count: providers.length,
      providers,
    },
  );
};

// APPROVE OR REJECT PROVIDER
const updateProviderStatus = async (req, res) => {
  const { status } = req.body || {};

  const updatedProvider = await changeProviderStatus(req.params.id, status);

  return sendSuccessResponse(
    res,
    200,
    `Provider successfully ${status.toLowerCase()}.`,
    updatedProvider,
  );
};

module.exports = {
  getPendingProviders,
  updateProviderStatus,
};
