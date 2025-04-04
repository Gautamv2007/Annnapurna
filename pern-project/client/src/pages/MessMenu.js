import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUtensils, FaSave, FaCheckCircle, FaEye } from "react-icons/fa";
import "./MessMenu.css";

const API_URL = "https://mybackend.loca.lt"; // Adjust if needed

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealOrder = ["breakfast", "lunch", "snacks", "dinner"]; // Correct meal order

function MessMenu() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealValue, setMealValue] = useState("");
  const [menu, setMenu] = useState({});
  const [showFullMenu, setShowFullMenu] = useState(false); // Control full menu visibility

  // **🔹 Fetch Mess Menu on Component Mount**
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messmenu`);
      const formattedMenu = {};
      response.data.forEach((item) => {
        formattedMenu[item.day] = item.meals;
      });
      setMenu(formattedMenu);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // **🔹 Update Local State**
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

  // **🔹 Submit Updated Menu**
  const handleSubmit = async () => {
    if (!selectedDay || !menu[selectedDay]) {
      alert("Please select a day and add meals before submitting.");
      return;
    }

    try {
      const updatedMenu = { day: selectedDay, meals: menu[selectedDay] };
      const response = await axios.post(`${API_URL}/api/update-messmenu`, updatedMenu);

      alert(response.data.message);
      fetchMenu(); // Refresh menu after update
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Failed to update menu.");
    }
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
          {mealOrder.map((meal) => (
            <option key={meal} value={meal}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</option>
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

      {/* Button to View Full Menu */}
      <button className="update-btn" onClick={() => setShowFullMenu(!showFullMenu)}>
        <FaEye /> {showFullMenu ? "Hide Full Menu" : "View Full Menu"}
      </button>

      {/* Display Full Weekly Menu */}
      {showFullMenu && (
        <div className="menu-display">
          {Object.keys(menu).map((day) => (
            <div key={day} className="menu-day">
              <h3>{day}</h3>
              {mealOrder.map((meal) => (
                menu[day] && menu[day][meal] ? (
                  <p key={meal}><strong>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</strong> {menu[day][meal]}</p>
                ) : null
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Submit Changes */}
      <button className="submit-btn" onClick={handleSubmit}>
        <FaSave /> Update Menu
      </button>
    </div>
  );
}

export default MessMenu;
