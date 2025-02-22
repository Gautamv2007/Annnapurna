import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Reviews.css";

const dummyReviews = [
  { id: 1, date: "2025-02-20", category: "Food Quality", detail: "Lunch - Tasty but less quantity.", comment: "" },
  { id: 2, date: "2025-02-21", category: "Cleanliness", detail: "Dining Hall - Needs improvement.", comment: "" },
  { id: 3, date: "2025-02-22", category: "Staff Behavior", detail: "Ramesh - Needs to be polite.", comment: "" },
  { id: 4, date: "2025-02-21", category: "Food Quality", detail: "Dinner - Overcooked rice.", comment: "" },
  { id: 5, date: "2025-02-22", category: "Cleanliness", detail: "Kitchen - Not cleaned properly.", comment: "" },
];

function Reviews() {
  const [reviews, setReviews] = useState(dummyReviews);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [comments, setComments] = useState({});

  // Filter reviews based on selected category and date
  const filteredReviews = reviews.filter((review) => {
    return (
      (categoryFilter === "All" || review.category === categoryFilter) &&
      (dateFilter === "" || review.date === dateFilter)
    );
  });

  // Handle comment change
  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  // Handle "Resolve" button click
  const handleResolve = (id) => {
    alert(`Review ID ${id} resolved with comment: ${comments[id] || "No comment"}`);
    setReviews(reviews.filter((review) => review.id !== id)); // Remove resolved review
  };

  return (
    <div className="reviews-container">
      <h2><FaStar /> Mess Reviews</h2>

      {/* Filter Section */}
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

      {/* Reviews Table */}
      <table className="reviews-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Details</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.date}</td>
                <td>{review.category}</td>
                <td>{review.detail}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={comments[review.id] || ""}
                    onChange={(e) => handleCommentChange(review.id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleResolve(review.id)}>Resolve</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No reviews found for the selected filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reviews;
