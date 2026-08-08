const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// 1. CREATE A NEW BOOKING (Customer)
router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json({ success: true, booking: savedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. GET ALL BOOKINGS FOR A SPECIFIC USER
router.get('/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. GET AVAILABLE JOBS (Matches Provider's Services & is Pending)
router.post('/available', async (req, res) => {
    try {
        const { services } = req.body; // Array of services the provider offers

        const availableJobs = await Booking.find({
            serviceName: { $in: services },
            status: 'Pending'
        }).sort({ createdAt: -1 }); // Newest first

        res.status(200).json(availableJobs);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. PROVIDER ACCEPTS A BOOKING
router.put('/:id/accept', async (req, res) => {
    try {
        const { providerEmail, providerName } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Accepted',
                providerEmail: providerEmail,
                providerName: providerName
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Job accepted successfully!", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. GET ALL JOBS ACCEPTED BY A SPECIFIC PROVIDER
router.get('/provider/:email', async (req, res) => {
    try {
        const jobs = await Booking.find({ providerEmail: req.params.email }).sort({ updatedAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. MARK A JOB AS COMPLETED
router.put('/:id/complete', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'Completed' },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Job marked as completed!", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 7. CUSTOMER LEAVES A REVIEW
router.put('/:id/review', async (req, res) => {
    try {
        const { rating, review } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { rating: rating, review: review },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Review submitted!", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;