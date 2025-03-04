import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RebateManagement.css';

function RebateManagement() {
  const navigate = useNavigate();
  const today = new Date();
  const maxStartDate = new Date();
  maxStartDate.setDate(today.getDate() + 5);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleStartDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate >= today && selectedDate <= maxStartDate) {
      setStartDate(e.target.value);
      setEndDate('');
    } else {
      alert('Start date should be within the next 5 days.');
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(maxEndDate.getDate() + 9);

    if (selectedEndDate <= maxEndDate) {
      setEndDate(e.target.value);
    } else {
      alert('End date should not exceed 9 days from the start date.');
    }
  };

  const handleOtpRequest = () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates first.');
      return;
    }
    setShowOtp(true);
  };

  const handleSubmit = () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }
    setSubmitted(true);
    alert('Rebate request submitted successfully! PDF generated.');
  };

  return (
    <div id="rebate-container">
      <h2 id="rebate-title">🎓 Rebate Management</h2>

      <div id="rebate-form">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          min={today.toISOString().split('T')[0]}
          max={maxStartDate.toISOString().split('T')[0]}
          value={startDate}
          onChange={handleStartDateChange}
        />

        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          type="date"
          min={startDate}
          value={endDate}
          onChange={handleEndDateChange}
          disabled={!startDate}
        />
      </div>

      {!showOtp && (
        <button id="request-otp-btn" onClick={handleOtpRequest} disabled={!startDate || !endDate}>
          Request OTP
        </button>
      )}

      {showOtp && (
        <div id="otp-section">
          <label htmlFor="otp-input">Enter OTP:</label>
          <input id="otp-input" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button id="submit-rebate-btn" onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {submitted && <p id="success-message">PDF Generated Successfully ✅</p>}

      <button id="back-btn" onClick={() => navigate('/student')}>Back</button>
    </div>
  );
}

export default RebateManagement;
