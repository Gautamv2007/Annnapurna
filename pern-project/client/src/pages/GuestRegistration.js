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
  const [transactionId, setTransactionId] = useState("");
  const [isTransactionIdEntered, setIsTransactionIdEntered] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricePerMeal = 50;
  const API_URL = "http://localhost:5000"; // Adjust according to your backend URL

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
    setLoading(true);
    if (!userEmail || !userEmail.includes("@")) {
      alert("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/send-otp-guest`, { email: userEmail });
      alert(response.data.message); // Show OTP sent message
      setShowOtpField(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  // Verify OTP from server
  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp-guest`, { email: userEmail, otp });
      if (response.data.message) {
        setIsOtpVerified(true);
        alert("OTP Verified! Proceed with payment.");
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

    if (!transactionId) {
      alert("Please enter the transaction ID for the payment.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/register-guest`,
        {
          guests,
          totalBill: calculateTotalBill(),
          email: userEmail,
          transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message) {
        alert("Guest registration successful!");
        const { user, guests, total_bill } = response.data;
        generatePDF(user, guests, total_bill, transactionId);
      }
    } catch (error) {
      console.error("Error submitting guest data:", error);
      alert("Failed to register guests. Please try again.");
    }
  };

  // Generate PDF with user, guests, and payment data
  const generatePDF = (user, guests, totalBill, transactionId) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Guest Registration Receipt", 20, 20);

    // User Details Section
    doc.setFontSize(14);
    doc.text("User Details:", 20, 40);
    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 50);
    doc.text(`Roll Number: ${user.roll_number}`, 20, 60);
    doc.text(`Branch: ${user.branch}`, 20, 70);
    doc.text(`Semester: ${user.semester}`, 20, 80);
    doc.text(`Hall Name: ${user.hall_name}`, 20, 90);
    doc.text(`Room No: ${user.room_no}`, 20, 100);
    doc.text(`Mobile Number: ${user.mobile_number}`, 20, 110);
    doc.text(`Email: ${user.email}`, 20, 120);

    // Guest Details Section
    doc.setFontSize(14);
    doc.text("Guest Details:", 20, 140);
    doc.setFontSize(12);
    guests.forEach((guest, index) => {
      doc.text(
        `Guest ${index + 1}: ${guest.name} - Meals: ${guest.meals.join(", ") || "None"}`,
        20,
        150 + index * 10
      );
    });

    // Total Bill Section
    doc.text(`Total Bill: ₹${totalBill}`, 20, 160 + guests.length * 10);

    // Transaction ID Section
    doc.text(`Transaction ID: ${transactionId}`, 20, 180 + guests.length * 10);

    // Save the PDF
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
          <button id="otp-btn" onClick={generateOTP} disabled={loading}>
            {loading ? "Sending OTP..." : "📩 Get OTP"}
          </button>
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

        {isOtpVerified && (
          <div id="payment-section">
            <h4>Payment QR Code:</h4>
            <img
              src="https://th.bing.com/th/id/OIP.NDKNbQ-I9ApLLVp-E6HSPwHaHa?w=190&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7" // Replace with the actual QR code image URL
              alt="Payment QR Code"
              style={{ width: "35%", height: "35%", marginBottom: "2vh" }}
            />
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                setIsTransactionIdEntered(!!e.target.value.trim());
              }}
            />
          </div>
        )}

        <button
          id="payment-btn"
          onClick={submitGuestData}
          disabled={!isTransactionIdEntered}
        >
          💳 Proceed to Payment & Download Receipt
        </button>
      </div>
    </div>
  );
}

export default GuestRegistration;