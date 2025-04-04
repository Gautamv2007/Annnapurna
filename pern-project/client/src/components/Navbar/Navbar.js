import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleNavigation = (sectionId) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getDashboardPath = () => {
    switch (role) {
      case "student":
        return "/student";
      case "admin":
        return "/admin";
      case "mess_staff":
        return "/mess-staff";
      case "security":
        return "/security";
      default:
        return "/";
    }
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Annapurna Logo" />
        <span className="navbar-title">Annapurna Dining Hall System</span>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li><button className="nav-btn" onClick={() => navigate("/")}>Home</button></li>
        <li><button className="nav-btn" onClick={() => handleNavigation("notifications")}>Notifications</button></li>
        <li><button className="nav-btn" onClick={() => handleNavigation("about-mess")}>Mess</button></li>
        <li><button className="nav-btn" onClick={() => handleNavigation("about-vendors")}>Vendors</button></li>
        <li><button className="nav-btn" onClick={() => handleNavigation("gallery")}>Delicacies</button></li>
        <li><button className="nav-btn" onClick={() => handleNavigation("contact")}>Contact</button></li>
      </ul>

      {/* User Buttons */}
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate(getDashboardPath())} className="btn">Dashboard</button>
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn">Login</button>
            <button onClick={() => navigate("/register")} className="btn register">Register</button>
          </>
        )}
      </div>

      {/* Hamburger Menu */}
      <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li><button className="nav-btn" onClick={() => navigate("/")}>Home</button></li>
          <li><button className="nav-btn" onClick={() => handleNavigation("notifications")}>Notifications</button></li>
          <li><button className="nav-btn" onClick={() => handleNavigation("about-mess")}>Mess</button></li>
          <li><button className="nav-btn" onClick={() => handleNavigation("about-vendors")}>Vendors</button></li>
          <li><button className="nav-btn" onClick={() => handleNavigation("gallery")}>Delicacies</button></li>
          <li><button className="nav-btn" onClick={() => handleNavigation("contact")}>Contact</button></li>
        </ul>
        <div className="mobile-buttons">
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate(getDashboardPath())} className="btn">Dashboard</button>
              <button onClick={handleLogout} className="btn logout">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn">Login</button>
              <button onClick={() => navigate("/register")} className="btn register">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
