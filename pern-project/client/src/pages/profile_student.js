import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileStudent.css";

const API_URL = "https://mybackend.loca.lt"; // Change if needed

function ProfileStudent() {
  const [activeTab, setActiveTab] = useState("rebates");
  const [rebates, setRebates] = useState([]);
  const [guests, setGuests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Format dates to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null/undefined values
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Fetch all data when component mounts
  useEffect(() => {
    fetchRebates();
    fetchGuests();
    fetchPayments();
    fetchReviews();
  }, []);

  // Fetch Rebate History
  const fetchRebates = async () => {
    try {
      const token = localStorage.getItem("token"); // User authentication
      const response = await axios.get(`${API_URL}/api/rebate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRebates(response.data);
    } catch (error) {
      console.error("Error fetching rebates:", error);
    }
  };

  // Fetch Guest Registrations
  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/guests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  // Fetch Payment Transactions
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div id="profile-container">
      <h2>📜 Student Profile</h2>
      
      {/* Tabs */}
      <div id="tabs">
        <button className={activeTab === "rebates" ? "active" : ""} onClick={() => setActiveTab("rebates")}>Rebate History</button>
        <button className={activeTab === "guests" ? "active" : ""} onClick={() => setActiveTab("guests")}>Guest Registration</button>
        <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>Wallet Transactions</button>
        <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>Review System</button>
      </div>

      {/* Dynamic Tables */}
      <div id="table-container">
        {activeTab === "rebates" && (
          <table id="rebate-table">
            <thead>
              <tr><th>Start Date</th><th>End Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rebates.length > 0 ? (
                rebates.map(row => (
                  <tr key={row.id}>
                    <td>{formatDate(row.start_date)}</td>
                    <td>{formatDate(row.end_date)}</td>
                    <td>{row.status || "Pending"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No rebates found</td></tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "guests" && (
          <table id="guest-table">
            <thead>
              <tr><th>Name</th><th>Date</th><th>Meal</th><th>Status</th></tr>
            </thead>
            <tbody>
              {guests.length > 0 ? (
                guests.map(row => (
                  <tr key={row.id}>
                    <td>{row.guest_name}</td>
                    <td>{formatDate(row.registration_date)}</td>
                    <td>{Array.isArray(row.meals) ? row.meals.join(", ") : row.meals}</td>
                    <td>{row.status || "Pending"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No guest registrations found</td></tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "payments" && (
          <table id="payment-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Type</th></tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map(row => (
                  <tr key={row.id}>
                    <td>{formatDate(row.date)}</td>
                    <td>₹{row.amount}</td>
                    <td>{row.type}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "reviews" && (
          <table id="review-table">
            <thead>
              <tr><th>Category</th><th>Feedback</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map(row => (
                  <tr key={row.id}>
                    <td>{row.category}</td>
                    <td>{row.review}</td>
                    <td>{"★".repeat(row.rating)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No reviews found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileStudent;
