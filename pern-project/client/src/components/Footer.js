import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer id="custom-footer-wrapper">
            <div id="custom-footer-container">
                {/* Contact Section */}
                <div id="custom-footer-contact">
                    <h2>Contact Us</h2>
                    <p>📱 +91 98765 43210</p>
                    <p>📧 mess@institute.ac.in</p>
                    <p>📍 IIIT Kurnool, Andhra Pradesh</p>
                </div>

                {/* Quick Links */}
                <div id="custom-footer-links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/gallery">Gallery</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div id="custom-footer-social">
                    <h2>Follow Us</h2>
                    <div className="custom-social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div id="custom-footer-bottom">
                <p>© 2025 Annapurna Dining. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
