import React from 'react';
import './StaticPage.css';

const About = () => {
    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>About Homemate</h1>
                <p>Building the future of home services.</p>
            </div>
            <div className="static-page-content">
                <h2>Our Mission</h2>
                <p>At Homemate, we believe that finding a reliable, skilled professional for your home shouldn't be a hassle. Our platform bridges the gap between expert service providers and homeowners who need high-quality work done safely and efficiently.</p>
                <h2>Why Choose Us?</h2>
                <ul>
                    <li><strong>Vetted Professionals:</strong> Every expert on our platform goes through a strict approval process.</li>
                    <li><strong>Transparent Pricing:</strong> No hidden fees. You know the estimated cost before you book.</li>
                    <li><strong>Secure & Seamless:</strong> A premium, modern dashboard to track your history and jobs.</li>
                </ul>
                <p>Whether you need a quick AC repair or a full home deep-clean, Homemate is your trusted partner.</p>
            </div>
        </div>
    );
};

export default About;