import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  //This code will prevent the page to 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error("Invalid server response");
        }

        if (!response.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("token", data.token);

        // 🔹 Redirect based on role
        switch (data.role) {
            case "admin":
                navigate("/admin", { replace: true });
                break;
            case "mess_staff":
                navigate("/mess-staff", { replace: true });
                break;
            case "security":
                navigate("/security", { replace: true });
                break;
            case "student":
                navigate("/student", { replace: true });
                break;
            default:
                navigate("/", { replace: true }); // Redirect to home if unknown role
        }

        window.location.reload(); // Ensure navbar updates instantly
    } catch (error) {
        console.error("Login error:", error.message);
        setError(error.message);
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
              <option value="mess_Staff">Mess Staff</option>
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
