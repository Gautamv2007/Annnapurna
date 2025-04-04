import React, { useState } from "react";
import axios from "axios";
import "./ReviewSystem.css";

const API_URL = "https://mybackend.loca.lt/api/reviews";

function ReviewSystem() {
  const [review, setReview] = useState("");
  const [category, setCategory] = useState("Staff");
  const [rating, setRating] = useState(0);
  const [staffName, setStaffName] = useState("");
  const [foodName, setFoodName] = useState("");
  const [mealDay, setMealDay] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [place, setPlace] = useState("");
  const [errors, setErrors] = useState({});

  const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const validateAndSubmit = async () => {
    let newErrors = {};
    let data = {
      category,
      review,
      rating,
    };

    if (category === "Staff") {
      if (!staffName.trim()) newErrors.staffName = "Staff name is required";
      data.staff_name = staffName;
    } else if (category === "Food") {
      if (!foodName.trim()) newErrors.foodName = "Food name is required";
      if (!mealDay.trim()) newErrors.mealDay = "Meal day is required";
      if (!mealTime.trim()) newErrors.mealTime = "Meal time is required";
      data.food_name = foodName;
      data.meal_day = mealDay;
      data.meal_time = mealTime;
    } else if (category === "Cleanliness") {
      if (!place.trim()) newErrors.place = "Place is required";
      data.place = place;
    }

    if (!review.trim()) newErrors.review = "Review cannot be empty";
    if (rating === 0) newErrors.rating = "Please select a rating";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(API_URL, data);
        alert(response.data.message);
        setReview("");
        setRating(0);
        setStaffName("");
        setFoodName("");
        setMealDay("");
        setMealTime("");
        setPlace("");
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  return (
    <div id="review-container">
      <h2 id="review-title">⭐ Review System</h2>

      <label id="review-label">Select Category:</label>
      <select
        id="review-category"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      >
        <option>Staff</option>
        <option>Food</option>
        <option>Cleanliness</option>
      </select>

      {category === "Staff" && (
        <>
          <input
            id="staff-name"
            type="text"
            placeholder="Enter Staff Name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          />
          {errors.staffName && <p className="error">{errors.staffName}</p>}
        </>
      )}

      {category === "Food" && (
        <>
          <input
            id="food-name"
            type="text"
            placeholder="Enter Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          {errors.foodName && <p className="error">{errors.foodName}</p>}

          <select
            id="meal-day"
            onChange={(e) => setMealDay(e.target.value)}
            value={mealDay}
          >
            <option value="">Select Meal Day</option>
            {validDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.mealDay && <p className="error">{errors.mealDay}</p>}

          <select
            id="meal-time"
            onChange={(e) => setMealTime(e.target.value)}
            value={mealTime}
          >
            <option value="">Select Meal Time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Dinner</option>
          </select>
          {errors.mealTime && <p className="error">{errors.mealTime}</p>}
        </>
      )}

      {category === "Cleanliness" && (
        <>
          <input
            id="place-name"
            type="text"
            placeholder="Enter Place Name"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
          {errors.place && <p className="error">{errors.place}</p>}
        </>
      )}

      <div id="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "star selected" : "star"}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      {errors.rating && <p className="error">{errors.rating}</p>}

      <textarea
        id="review-textarea"
        placeholder="Write your review..."
        onChange={(e) => setReview(e.target.value)}
        value={review}
      />
      {errors.review && <p className="error">{errors.review}</p>}

      <button id="review-submit-btn" onClick={validateAndSubmit}>
        Submit Review
      </button>
    </div>
  );
}

export default ReviewSystem;
