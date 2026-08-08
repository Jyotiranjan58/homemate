const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Provider = require('../models/Provider');

const router = express.Router();

// ==========================================
// 1. USER AUTHENTICATION
// ==========================================
router.post('/user/signup', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already in use." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials." });

        // Remove password before sending to frontend
        const { password: _, ...userData } = user._doc;
        res.status(200).json({ success: true, user: userData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 2. PROVIDER AUTHENTICATION
// ==========================================
router.post('/provider/signup', async (req, res) => {
    try {
        const { name, email, mobile, password, city, providedServices } = req.body;

        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) return res.status(400).json({ success: false, message: "Email already in use." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newProvider = new Provider({
            name, email, mobile, password: hashedPassword, city, providedServices
        });
        await newProvider.save();

        res.status(201).json({ success: true, message: "Provider application submitted for review." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/provider/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const provider = await Provider.findOne({ email });
        if (!provider) return res.status(404).json({ success: false, message: "Provider not found." });

        const isMatch = await bcrypt.compare(password, provider.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials." });

        if (provider.status !== 'Approved') {
            return res.status(403).json({ success: false, message: "Your account is pending admin approval." });
        }

        const { password: _, ...providerData } = provider._doc;
        res.status(200).json({ success: true, user: providerData }); // Keep key as 'user' for AuthContext compatibility
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ==========================================
// 3. PROFILE UPDATE ROUTES
// ==========================================

// Update Customer Profile
router.put('/user/:email/update', async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            { name, mobile },
            { new: true }
        ).select('-password');

        res.status(200).json({ success: true, message: "Profile updated!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update Provider Profile
router.put('/provider/:email/update', async (req, res) => {
    try {
        const { name, mobile, city, providedServices } = req.body;
        const updatedProvider = await Provider.findOneAndUpdate(
            { email: req.params.email },
            { name, mobile, city, providedServices },
            { new: true }
        ).select('-password');

        res.status(200).json({ success: true, message: "Profile updated!", user: updatedProvider });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;