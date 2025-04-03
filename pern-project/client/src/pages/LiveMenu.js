import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MessMenu1.css"; // Ensure styles are applied correctly

const mealOrder = ["breakfast", "lunch", "snacks", "dinner"];

// Function to determine current meal based on time
const getCurrentMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return "breakfast";
  if (hour >= 12 && hour < 15) return "lunch";
  if (hour >= 15 && hour < 18) return "snacks";
  return "dinner";
};

const LiveMenu = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentMealTime, setCurrentMealTime] = useState(getCurrentMealTime());
  const [currentDay, setCurrentDay] = useState(
    new Date().toLocaleString("en-us", { weekday: "long" })
  );
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

  // Fetch Menu from API
  const fetchMenu = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/messmenu");
      setMenuData(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Update Time Every Minute (Without Changing Meal or Day)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Updates every minute

    return () => clearInterval(timer);
  }, []);

  // Update selected day's menu (without affecting the current meal)
  useEffect(() => {
    setSelectedMenu(menuData.find((item) => item.day === selectedDay));
  }, [selectedDay, menuData]);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  return (
    <div id="mess-menu">
      <h1>📅 Live Mess Menu</h1>

      {/* Display Current Date, Time, and Meal */}
      <div className="current-time">
        <p>
          <strong>Current Date and Time:</strong> {currentDateTime.toLocaleString()}
        </p>
        <p>
          <strong>Today's Day:</strong> {currentDay}
        </p>
        <p>
          <strong>Current Meal:</strong> {currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1)}
        </p>
      </div>

      {/* Current Meal for Today */}
      <div className="menu-section">
        <h2>Current {currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1)} Menu</h2>
        <div className="menu-list">
          {menuData.length > 0 ? (
            <div className="menu-item">
              {menuData.find((item) => item.day === currentDay)?.meals[currentMealTime] || "No menu available"}
            </div>
          ) : (
            <p>Loading menu...</p>
          )}
        </div>
      </div>

      {/* Day Selector */}
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

      {/* Full Menu for Selected Day */}
      <div className="menu-section">
        <h2>{selectedDay} Full Menu</h2>
        <div className="menu-list">
          {selectedMenu ? (
            mealOrder.map((meal) => (
              <div key={meal} className="menu-item">
                <strong>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</strong>{" "}
                {selectedMenu.meals[meal] || "No menu available"}
              </div>
            ))
          ) : (
            <p>Loading menu...</p>
          )}
        </div>
      </div>

      {/* Weekly Menu Toggle */}
      <div className="weekly-menu">
        <h2>Full Weekly Menu</h2>
        <button onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}>
          {showWeeklyMenu ? "Hide" : "View"} Weekly Menu
        </button>
        {showWeeklyMenu && (
          <div className="menu-list">
            {menuData.map((item) => (
              <div key={item.day} className="weekday">
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
