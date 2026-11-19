const {
  getPendingProviders: fetchPendingProviders,
  updateProviderStatus: changeProviderStatus,
} = require("./admin.service");

// GET ALL PENDING PROVIDERS
const getPendingProviders = async (req, res) => {
  const providers = await fetchPendingProviders();

  return res.status(200).json({
    success: true,
    count: providers.length,
    providers,
  });
};

// APPROVE OR REJECT PROVIDER
const updateProviderStatus = async (req, res) => {
  const { status } = req.body || {};

  const updatedProvider = await changeProviderStatus(req.params.id, status);

  return res.status(200).json({
    success: true,
    message: `Provider successfully ${status.toLowerCase()}.`,
    provider: updatedProvider,
  });
};

module.exports = {
  getPendingProviders,
  updateProviderStatus,
};
