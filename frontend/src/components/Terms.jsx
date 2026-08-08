import React from 'react';
import './StaticPage.css';

const Terms = () => {
    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>Terms & Conditions</h1>
                <p>Last updated: October 2023</p>
            </div>
            <div className="static-page-content">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using Homemate, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
                <h2>2. User Responsibilities</h2>
                <p>Customers agree to provide accurate addresses and contact information for bookings. Providers agree to deliver services to the best of their professional ability and maintain a respectful environment.</p>
                <h2>3. Cancellations & Refunds</h2>
                <p>Bookings can be cancelled without penalty up to 2 hours before the scheduled time. Cancellations made after this window may be subject to a nominal cancellation fee.</p>
            </div>
        </div>
    );
};

export default Terms;