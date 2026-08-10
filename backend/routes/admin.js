const express = require('express');
const Provider = require('../models/Provider');

const router = express.Router();

// 1. GET ALL PENDING PROVIDERS
router.get('/providers/pending', async (req, res) => {
    try {
        const pendingProviders = await Provider.find({ status: 'Pending Review' }).select('-password');
        res.status(200).json(pendingProviders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. APPROVE OR REJECT A PROVIDER
router.put('/providers/:id/status', async (req, res) => {
    try {
        const { status } = req.body; 

        const updatedProvider = await Provider.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        ).select('-password');

        res.status(200).json({ success: true, message: `Provider successfully ${status.toLowerCase()}.`, provider: updatedProvider });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
