import React, { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import "./GuestRegistration.css";

function GuestRegistration() {
  const [guests, setGuests] = useState([{ name: "", meals: [] }]);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const pricePerMeal = 50;
  const API_URL = "https://mybackend.loca.lt"; // Adjust according to your backend URL

  const addGuest = () => {
    setGuests([...guests, { name: "", meals: [] }]);
  };

  const removeGuest = (index) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
  };

  const handleGuestNameChange = (index, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index].name = value;
    setGuests(updatedGuests);
  };

  const handleMealSelection = (guestIndex, meal) => {
    const updatedGuests = [...guests];
    const meals = updatedGuests[guestIndex].meals;
    if (meals.includes(meal)) {
      updatedGuests[guestIndex].meals = meals.filter((m) => m !== meal);
    } else {
      updatedGuests[guestIndex].meals = [...meals, meal];
    }
    setGuests(updatedGuests);
  };

  const calculateTotalBill = () => {
    return guests.reduce((total, guest) => total + guest.meals.length * pricePerMeal, 0);
  };

  // Request OTP from server
  const generateOTP = async () => {
    if (!userEmail || !userEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/send-otp`, { email: userEmail });
      alert(response.data.message); // Show OTP sent message
      setShowOtpField(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.error || "Failed to send OTP. Please try again.");
    }
  };
  

  // Verify OTP from server
  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp-guest`, { email: userEmail, otp });
      if (response.data.message) {
        setIsOtpVerified(true);
        alert("OTP Verified! Proceeding with payment.");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Invalid OTP. Please try again.");
    }
  };
  

  // Submit guest data to the server
  const submitGuestData = async () => {
    if (!isOtpVerified) {
      alert("Please verify your OTP first.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/register-guest`, {
        guests,
        totalBill: calculateTotalBill(),
        email: userEmail,
      });

      if (response.data.message) {
        alert("Guest registration successful!");
        generatePDF();
      }
    } catch (error) {
      console.error("Error submitting guest data:", error);
      alert("Failed to register guests. Please try again.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Guest Registration Receipt", 20, 20);

    doc.setFontSize(12);
    guests.forEach((guest, index) => {
      doc.text(
        `Guest ${index + 1}: ${guest.name} - Meals: ${guest.meals.join(", ") || "None"}`,
        20,
        40 + index * 10
      );
    });

    doc.text(`Total Bill: ₹${calculateTotalBill()}`, 20, 60 + guests.length * 10);
    doc.save("Guest_Receipt.pdf");
    alert("Receipt downloaded successfully!");
  };

  return (
    <div id="guest-container">
      <h2 id="guest-title">👥 Guest Registration</h2>
      <div id="guest-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        
        {guests.map((guest, index) => (
          <div className="guest-entry" key={index}>
            <input
              type="text"
              placeholder={`Guest ${index + 1} Name`}
              value={guest.name}
              onChange={(e) => handleGuestNameChange(index, e.target.value)}
            />
            <button className="remove-guest-btn" onClick={() => removeGuest(index)} disabled={guests.length === 1}>
              ✖
            </button>
            <div className="meal-options">
              {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                <label key={meal}>
                  <input
                    type="checkbox"
                    checked={guest.meals.includes(meal)}
                    onChange={() => handleMealSelection(index, meal)}
                  />
                  {meal}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button id="add-guest-btn" onClick={addGuest}>➕ Add Guest</button>

        <p id="total-bill">Total Bill: ₹{calculateTotalBill()}</p>

        {!showOtpField ? (
          <button id="otp-btn" onClick={generateOTP}>📩 Get OTP</button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button id="verify-otp-btn" onClick={verifyOTP}>✅ Verify OTP</button>
          </>
        )}

        <button id="payment-btn" onClick={submitGuestData} disabled={!isOtpVerified}>
          💳 Proceed to Payment & Download Receipt
        </button>
      </div>
    </div>
  );
}

export default GuestRegistration;
