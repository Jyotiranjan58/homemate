const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    providerEmail: { type: String, default: null },
    providerName: { type: String, default: null },

    // --- NEW FIELDS ---
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);