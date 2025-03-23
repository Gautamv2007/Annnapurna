import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MessMenu1.css"; // Ensure styles are applied correctly

const mealOrder = ["breakfast", "lunch", "snacks", "dinner"];

const getCurrentMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return "breakfast";
  if (hour >= 12 && hour < 15) return "lunch";
  if (hour >= 15 && hour < 18) return "snacks";
  return "dinner";
};

const LiveMenu = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleString("en-us", { weekday: "long" }));
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  
  const [currentMealTime, setCurrentMealTime] = useState(getCurrentMealTime());

  // Fetch Menu from API
  const fetchMenu = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/messmenu");
      setMenuData(response.data);
      setSelectedMenu(response.data.find((item) => item.day === selectedDay));
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }, [selectedDay]);

  // Fetch menu on component mount and when selected day changes
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Update Time and Meal Every Second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
      setCurrentMealTime(getCurrentMealTime());
    }, 1000); // Updates every second

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  const handleDayChange = (event) => {
    const newDay = event.target.value;
    setSelectedDay(newDay);
    setSelectedMenu(menuData.find((item) => item.day === newDay));
  };

  return (
    <div id="mess-menu">
      <h1>📅 Live Mess Menu</h1>

      <div className="current-time">
        <p><strong>Current Date and Time:</strong> {currentDateTime.toLocaleString()}</p>
        <p><strong>Current Meal:</strong> {currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1)}</p>
      </div>

      {/* Current Meal Menu */}
      <div className="menu-section">
        <h2>{currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1)} Menu</h2>
        <div className="menu-list">
          {selectedMenu ? (
            <div className="menu-item">{selectedMenu.meals[currentMealTime] || "No menu available"}</div>
          ) : (
            <p>Loading menu...</p>
          )}
        </div>
      </div>

      {/* Select Menu by Day */}
      <div className="menu-selection">
        <label htmlFor="day-select">Select Day:</label>
        <select id="day-select" value={selectedDay} onChange={handleDayChange}>
          {menuData.map((item) => (
            <option key={item.day} value={item.day}>
              {item.day}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Day Menu (Ordered: Breakfast -> Lunch -> Snacks -> Dinner) */}
      <div className="menu-section">
        <h2>{selectedDay} Full Menu</h2>
        <div className="menu-list">
          {selectedMenu ? (
            mealOrder.map((meal) => (
              <div key={meal} className="menu-item">
                <strong>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</strong> {selectedMenu.meals[meal] || "No menu available"}
              </div>
            ))
          ) : (
            <p>Loading menu...</p>
          )}
        </div>
      </div>

      {/* Weekly Menu */}
      <div className="weekly-menu">
        <h2>Full Weekly Menu</h2>
        <button onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}>View Weekly Menu</button>
        {showWeeklyMenu && (
          <div className="menu-list">
            {menuData.map((item, index) => (
              <div key={index} className="weekday">
                <h3>{item.day}</h3>
                {mealOrder.map((meal) => (
                  <div key={meal} className="time-slot">
                    <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</h4>
                    <p>{item.meals[meal] || "No menu available"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMenu;

