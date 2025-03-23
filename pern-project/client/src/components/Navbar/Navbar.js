import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Annapurna Logo" />
        <span className="navbar-title">Annapurna Dining Hall System</span>
      </div>

      <ul className="navbar-links">
        <li><button onClick={() => navigate("/")}>Home</button></li>
        <li><button onClick={() => navigate("/notifications")}>Notifications</button></li>
        <li><button onClick={() => navigate("/about-mess")}>Mess</button></li>
        <li><button onClick={() => navigate("/about-vendors")}>Vendors</button></li>
        <li><button onClick={() => navigate("/gallery")}>Delicacies</button></li>
        <li><button onClick={() => navigate("/contact")}>Contact</button></li>
      </ul>

      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <span className="user-role">Welcome, {role}!</span>
            {role === "Student" && (
              <button onClick={() => navigate("/student")} className="btn student-page">
                Go to Student Page
              </button>
            )}
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn login">Login</button>
            <button onClick={() => navigate("/register")} className="btn register">Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
