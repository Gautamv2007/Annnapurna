import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./Reviews.css";

const API_URL = "http://localhost:5000"; // Adjust if needed

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews`);
      
      // Convert created_at to a readable format
      const formattedReviews = response.data.map((review) => ({
        ...review,
        formatted_date: new Date(review.created_at).toLocaleDateString("en-GB") // Format: DD/MM/YYYY
      }));

      console.log("Fetched Reviews:", formattedReviews);
      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    return (
      (categoryFilter === "All" || review.category === categoryFilter) &&
      (dateFilter === "" || review.formatted_date === dateFilter)
    );
  });

  return (
    <div className="reviews-container">
      <h2><FaStar /> Mess Reviews</h2>

      <div className="filter-section">
        <label>Filter by Category:</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Food Quality">Food Quality</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Staff Behavior">Staff Behavior</option>
        </select>

        <label>Filter by Date:</label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      <table className="reviews-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.formatted_date || "No Date Available"}</td>
                <td>{review.category}</td>
                <td>{review.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No reviews found for the selected filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reviews;



