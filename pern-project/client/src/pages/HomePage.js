import React from "react";
import Slider from "../components/Slider";
import Notifications from "../components/Notifications";
import AboutMess from "../components/AboutMess";
import AboutVendor from "../components/AboutVendor";
import Gallery from "../components/Gallery";
import InteractiveMap from "../components/InteractiveMap";
import ContactSection from "../components/ContactSection";
import "./HomePage.css";

const HomePage = () => {
  

  return (
    <div className="homepage-wrapper">
      <main className="homepage-content">
        <div id="home"><Slider /></div>
        <div id="notifications"><Notifications /></div>
        <div id="about-mess"><AboutMess /></div>
        <div id="about-vendors"><AboutVendor /></div>
        <div id="gallery"><Gallery /></div>
        <InteractiveMap />
        <div id="contact"><ContactSection /></div>
      </main>
    </div>
  );
};

export default HomePage;
