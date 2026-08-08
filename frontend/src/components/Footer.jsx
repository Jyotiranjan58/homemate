import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    // Helper function to scroll to top when a footer link is clicked
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <footer className="premium-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3>Homemate</h3>
                    <p>Your trusted marketplace for finding expert home service professionals. Quality work, guaranteed.</p>
                </div>

                <div className="footer-column">
                    <h4>Top Services</h4>
                    <ul className="footer-links">
                        <li><Link to="/" onClick={scrollToTop}>AC Repair</Link></li>
                        <li><Link to="/" onClick={scrollToTop}>Electrician</Link></li>
                        <li><Link to="/" onClick={scrollToTop}>Home Cleaning</Link></li>
                        <li><Link to="/" onClick={scrollToTop}>Plumbing</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><Link to="/about" onClick={scrollToTop}>About Us</Link></li>
                        <li><Link to="/partner" onClick={scrollToTop}>Become a Professional</Link></li>
                        <li><Link to="/terms" onClick={scrollToTop}>Terms & Conditions</Link></li>
                        <li><Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Contact Us</h4>
                    <ul className="footer-links">
                        {/* Native HTML links for email and phone functionality */}
                        <li><a href="mailto:help@homemate.com">Support: help@homemate.com</a></li>
                        <li><a href="mailto:pros@homemate.com">Partners: pros@homemate.com</a></li>
                        <li><a href="tel:18001234567">Phone: 1800-123-4567</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Homemate Marketplace. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;