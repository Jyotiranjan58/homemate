const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true },
    city: { type: String, required: true },
    providedServices: [{ type: String, required: true }], // e.g., ['Electrician', 'Plumber']
    status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' },
    role: { type: String, default: 'provider' } // Strict role
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);