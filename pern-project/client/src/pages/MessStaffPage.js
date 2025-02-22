import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaUsers, FaStar } from "react-icons/fa";
import "./MessPeople.css";

function MessDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>🍽️ Mess Dashboard</h2>
      <div className="dashboard-buttons">
        <button className="dashboard-btn" onClick={() => navigate("/mess-menu")}>
          <FaUtensils /> Mess Menu Management
        </button>
        <button className="dashboard-btn" onClick={() => navigate("/attendance-earnings")}>
          <FaUsers /> Attendance & Earnings
        </button>
        <button className="dashboard-btn" onClick={() => navigate("/reviews")}>
          <FaStar /> Reviews & Feedback
        </button>
      </div>
    </div>
  );
}

export default MessDashboard;
