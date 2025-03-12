import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios"; // Import axios for API calls
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/dashboard");
    } catch (error) {
        alert(error.message);
    }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p className="subtext">Please login to continue</p>

        {error && <p className="error-message">{error}</p>} {/* Display errors */}

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
