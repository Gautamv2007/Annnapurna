import React from 'react';
import './AboutMess.css';
import logo from './logo.png'; // Import the logo

const AboutMess = () => {
  return (
    <div className="about-box">
      {/* Left Side: Logo */}
      <div className="logo-section">
        <img src={logo} alt="Mess Logo" className="mess-logo" />
      </div>

      {/* Right Side: Content */}
      <div className="content-section">
        <h1 className="title">Akshaya Dining Hall</h1>
        <h2 className="subtitle">Serving Quality, Hygiene & Taste</h2>
        <p className="description">
          Annapurna Dining Hall has been a trusted name in providing <b>healthy, hygienic, and delicious</b> meals for students.  
          We ensure a <b>balanced diet</b> with carefully curated meal plans that offer a variety of <b>regional and international cuisines</b>.  
          Our mission is to provide <b>nutritious food with a homely experience</b> to keep students healthy and energized.
        </p>
      </div>
    </div>
  );
};

export default AboutMess;
