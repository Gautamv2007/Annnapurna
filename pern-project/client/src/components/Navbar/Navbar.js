import React from "react";
import "./Navbar.css";

const Navbar = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Annapurna Logo" />
        <span className="navbar-title">Annapurna Dining Hall System</span>
      </div>
      <ul className="navbar-links">
        <li><button onClick={() => scrollToSection("home")}>Home</button></li>
        <li><button onClick={() => scrollToSection("notifications")}>Notifications</button></li>
        <li><button onClick={() => scrollToSection("about-mess")}>Mess</button></li>
        <li><button onClick={() => scrollToSection("about-vendors")}>Vendors</button></li>
        <li><button onClick={() => scrollToSection("gallery")}>Delicacies</button></li>
        <li><button onClick={() => scrollToSection("contact")}>Contact</button></li>
      </ul>
      <div className="navbar-buttons">
        <a href="/login" className="btn login">Login</a>
        <a href="/register" className="btn register">Register</a>
      </div>
    </nav>
  );
};

export default Navbar;
