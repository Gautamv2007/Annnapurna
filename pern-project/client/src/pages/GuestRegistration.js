import React, { useState } from "react";
import jsPDF from "jspdf";
import "./GuestRegistration.css";

function GuestRegistration() {
  const [guests, setGuests] = useState([{ name: "", meals: [] }]);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const pricePerMeal = 50;

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

  const generateOTP = () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    alert(`Your OTP is: ${otpCode}`); // Replace with actual OTP sending method
    setShowOtpField(true);
  };

  const verifyOTP = () => {
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      alert("OTP Verified! Proceeding with payment.");
    } else {
      alert("Invalid OTP. Please try again.");
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

        <button id="payment-btn" onClick={generatePDF} disabled={!isOtpVerified}>
          💳 Proceed to Payment & Download Receipt
        </button>
      </div>
    </div>
  );
}

export default GuestRegistration;
