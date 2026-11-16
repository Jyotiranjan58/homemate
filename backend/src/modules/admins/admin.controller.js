const {
  getPendingProviders: fetchPendingProviders,
  updateProviderStatus: changeProviderStatus,
} = require("./admin.service");

// GET ALL PENDING PROVIDERS
const getPendingProviders = async (req, res) => {
  try {
    const providers = await fetchPendingProviders();

    return res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (err) {
    console.error("Get Pending Providers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending providers.",
    });
  }
};

// APPROVE OR REJECT PROVIDER
const updateProviderStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    const updatedProvider = await changeProviderStatus(req.params.id, status);

    return res.status(200).json({
      success: true,
      message: `Provider successfully ${status.toLowerCase()}.`,
      provider: updatedProvider,
    });
  } catch (err) {
    console.error("Update Provider Status Error:", err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode
        ? err.message
        : "Unable to update provider status.",
    });
  }
};

module.exports = {
  getPendingProviders,
  updateProviderStatus,
};
