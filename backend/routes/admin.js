const express = require("express");
const mongoose = require("mongoose");

const Provider = require("../models/Provider");

const authenticateToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

// 1. GET ALL PENDING PROVIDERS
router.get("/providers/pending", async (req, res) => {
  try {
    const pendingProviders = await Provider.find({
      status: "Pending Review",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pendingProviders.length,
      providers: pendingProviders,
    });
  } catch (err) {
    console.error("Get Pending Providers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending providers.",
    });
  }
});

// 2. APPROVE OR REJECT A PROVIDER
router.put("/providers/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either Approved or Rejected.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid provider ID.",
      });
    }

    const updatedProvider = await Provider.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "Pending Review",
      },
      {
        $set: { status },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedProvider) {
      const existingProvider = await Provider.findById(req.params.id).select(
        "_id status",
      );

      if (!existingProvider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "This provider application has already been reviewed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Provider successfully ${status.toLowerCase()}.`,
      provider: updatedProvider,
    });
  } catch (err) {
    console.error("Update Provider Status Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to update provider status.",
    });
  }
});

module.exports = router;
