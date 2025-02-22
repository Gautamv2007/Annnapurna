import React from 'react';
import './AboutMess.css';
import logo from './logo1.png'; // Import the logo

const AboutMess = () => {
  return (
    <div className="about-box">
      {/* Left Side: Logo */}
      <div className="logo-section">
        <img src={logo} alt="Mess Logo" className="mess-logo" />
      </div>

      {/* Right Side: Content */}
      <div className="content-section">
        <h1 className="title">Hill Top Dining Hall</h1>
        <h2 className="subtitle">Serving Quality, Hygiene & Taste</h2>
        <p className="description">
          Our mess is currently operated by <b>[Current Vendor]</b>, ensuring high-quality meals for students.  
          With a strong focus on <b>hygiene and balanced nutrition</b>, they bring a wide variety of dishes, catering to different tastes and preferences.    
          We continuously work with the vendor to improve food quality, menu diversity, and overall satisfaction.  
        </p>
      </div>
    </div>
  );
};

export default AboutMess;
