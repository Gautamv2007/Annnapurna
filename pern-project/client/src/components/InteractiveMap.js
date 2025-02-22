import React from "react";
import "./InteractiveMap.css";

const InteractiveMap = () => {
  return (
    <div className="map-section">
      <h2 className="map-title">Find Us Here</h2>
      <div className="map-container">
        <iframe
          title="Mess Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.745782290889!2d78.03621865516229!3d15.75958749699104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5dda3d6e00c2b%3A0x9c6b0c39f654ebc2!2sHill%20Top%20Dining%20Hall!5e0!3m2!1sen!2sin!4v1739711628520!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default InteractiveMap;
