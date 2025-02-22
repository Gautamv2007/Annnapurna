import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import "./LoginForm.css";
import Footer from "../Footer.js"; // Assuming footer is in components

function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select a valid role!");
      return;
    }

    navigate(`/${role.toLowerCase().replace(" ", "-")}`); // Auto format route
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p className="subtext">Please login to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><FaUserCircle className="icon" /> Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">--Select Role--</option>
              <option value="Admin">Admin</option>
              <option value="Mess Staff">Mess Staff</option>
              <option value="Security">Security</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaEnvelope className="icon" /> Email</label>
            <input 
              type="email" 
              placeholder="Enter Institute Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label><FaLock className="icon" /> Password</label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="register-link">Don't have an account? <a href="/register">Sign Up</a></p>
      </div>
    </div>
  );
}

export default LoginForm;
