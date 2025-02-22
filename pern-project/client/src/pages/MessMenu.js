import React, { useState } from "react";
import { FaUtensils, FaSave, FaCheckCircle, FaKey } from "react-icons/fa";
import "./MessMenu.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTimes = ["Morning", "Afternoon", "Evening", "Dinner"];

function MessMenu() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealValue, setMealValue] = useState("");
  const [menu, setMenu] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleMenuUpdate = () => {
    if (!selectedDay || !selectedMeal || !mealValue) {
      alert("Please select a day, meal time, and enter a meal!");
      return;
    }
    
    setMenu((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [selectedMeal]: mealValue,
      },
    }));

    setMealValue(""); // Reset input after adding
  };

  const handleOtpRequest = () => {
    setOtpSent(true);
    alert("OTP sent to registered email.");
  };

  const handleSubmit = () => {
    if (!otp) {
      alert("Enter OTP to confirm changes!");
      return;
    }
    alert("Menu updated successfully!");
  };

  return (
    <div className="menu-container">
      <h2><FaUtensils /> Mess Menu Management</h2>

      {/* Dropdown for selecting day */}
      <div className="dropdown-container">
        <label>Select Day:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          <option value="">Choose a day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Dropdown for selecting meal time */}
      <div className="dropdown-container">
        <label>Select Meal Time:</label>
        <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
          <option value="">Choose a meal time</option>
          {mealTimes.map((meal) => (
            <option key={meal} value={meal}>{meal}</option>
          ))}
        </select>
      </div>

      {/* Input field for meal entry */}
      <div className="meal-input-container">
        <label>Enter Meal:</label>
        <input
          type="text"
          placeholder="Enter meal name"
          value={mealValue}
          onChange={(e) => setMealValue(e.target.value)}
        />
      </div>

      {/* Button to update menu */}
      <button className="update-btn" onClick={handleMenuUpdate}>
        <FaCheckCircle /> Add Meal
      </button>

      {/* Display updated menu */}
      <div className="menu-display">
        {Object.keys(menu).map((day) => (
          <div key={day} className="menu-day">
            <h3>{day}</h3>
            {Object.keys(menu[day]).map((meal) => (
              <p key={meal}><strong>{meal}:</strong> {menu[day][meal]}</p>
            ))}
          </div>
        ))}
      </div>

      {/* OTP Section */}
      <button className="otp-btn" onClick={handleOtpRequest}>
        <FaKey /> Request OTP
      </button>

      {otpSent && (
        <div className="otp-section">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            <FaSave /> Update Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default MessMenu;
