import React from 'react';
import './StaticPage.css';

const Privacy = () => {
    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>Privacy Policy</h1>
                <p>How we protect your data.</p>
            </div>
            <div className="static-page-content">
                <h2>Information We Collect</h2>
                <p>We collect information you provide directly to us, such as your name, email address, phone number, and home address when you create an account or book a service.</p>
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services. Your address and phone number are only shared with the specific professional who accepts your booking.</p>
                <h2>Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. We do not sell your personal data to third parties.</p>
            </div>
        </div>
    );
};

export default Privacy;