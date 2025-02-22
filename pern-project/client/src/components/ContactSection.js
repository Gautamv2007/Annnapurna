import React from "react";
import "./ContactSection.css";

const ContactSection = () => {
  return (
    <div className="contact-section">
      <h2 className="contact-title">📞 Contact Us</h2>
      <div className="contact-card">
        <p><strong>📱 Phone:</strong> +91 98765 43210</p>
        <p><strong>📧 Email:</strong> mess@institute.ac.in</p>
        <p><strong>📍 Address:</strong> Institute Mess, IIIT Kurnool, Andhra Pradesh, India</p>
      </div>
    </div>
  );
};

export default ContactSection;
