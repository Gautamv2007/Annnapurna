import React, { useState, useEffect } from "react";
import "./MessMenu1.css"; // Scoped CSS file

const menuData = {
  0: { morning: "Pancake, Coffee", afternoon: "Grilled Chicken", evening: "Pasta", night: "Pizza" },
  1: { morning: "Toast, Eggs", afternoon: "Burgers", evening: "Fish and Chips", night: "Noodles" },
  2: { morning: "Cereal, Milk", afternoon: "Pizza", evening: "Sandwich", night: "Tacos" },
  3: { morning: "Bagels, Coffee", afternoon: "Steak", evening: "Sushi", night: "Ramen" },
  4: { morning: "Omelette, Coffee", afternoon: "Spaghetti", evening: "Salad", night: "Burritos" },
  5: { morning: "Pancakes, Tea", afternoon: "Sandwich", evening: "BBQ Chicken", night: "Fried Rice" },
  6: { morning: "Croissants, Coffee", afternoon: "Grilled Veggies", evening: "Steak", night: "Mac & Cheese" },
};

const getCurrentMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 15) return "afternoon";
  if (hour >= 15 && hour < 18) return "evening";
  return "night";
};

const MessMenu = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [currentMealTime, setCurrentMealTime] = useState(getCurrentMealTime());
  const [selectedMenu, setSelectedMenu] = useState(menuData[selectedDay]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      setCurrentMealTime(getCurrentMealTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDayChange = (event) => {
    const day = parseInt(event.target.value, 10);
    setSelectedDay(day);
    setSelectedMenu(menuData[day]);
  };

  return (
    <div id="mess-menu"> {/* This ID ensures CSS styles don't affect other elements */}
      <h1>Weekly Menu</h1>
      <div className="current-time">
        <p>
          <strong>Current Date and Time:</strong> {currentDateTime.toLocaleString()}
        </p>
        <p>
          <strong>Current Meal Time:</strong> {currentMealTime.charAt(0).toUpperCase() + currentMealTime.slice(1)}
        </p>
      </div>

      {/* Today's Menu */}
      <div className="menu-section">
        <h2>Today's Menu</h2>
        <div className="menu-list">
          <div className="menu-item">{menuData[new Date().getDay()][currentMealTime]}</div>
        </div>
      </div>

      {/* Select Menu by Day */}
      <div className="menu-selection">
        <label htmlFor="day-select">Select Day:</label>
        <select id="day-select" value={selectedDay} onChange={handleDayChange}>
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Day Menu */}
      <div className="menu-section">
        <h2>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDay]} Menu</h2>
        <div className="menu-list">
          {Object.entries(selectedMenu).map(([meal, food], index) => (
            <div key={index} className="menu-item">
              <strong>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</strong> {food}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Menu */}
      <div className="weekly-menu">
        <h2>Full Weekly Menu</h2>
        <button onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}>View Weekly Menu</button>
        {showWeeklyMenu && (
          <div className="menu-list">
            {Object.entries(menuData).map(([day, meals], index) => (
              <div key={index} className="weekday">
                <h3>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}</h3>
                {Object.entries(meals).map(([meal, food], mealIndex) => (
                  <div key={mealIndex} className="time-slot">
                    <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</h4>
                    <p>{food}</p>
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

export default MessMenu;
