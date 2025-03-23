import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RebateManagement.css';

function RebateManagement() {
  const navigate = useNavigate();
  const today = new Date();
  const maxStartDate = new Date();
  maxStartDate.setDate(today.getDate() + 5);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previousEndDate, setPreviousEndDate] = useState(null);

  // Load previous end_date from localStorage
  useEffect(() => {
    const savedEndDate = localStorage.getItem('rebateEndDate');
    if (savedEndDate) {
      setPreviousEndDate(savedEndDate);
      const currentDate = new Date();
      if (new Date(savedEndDate) > currentDate) {
        setSubmitted(true);
      } else {
        localStorage.removeItem('rebateEndDate'); // Clear old data
      }
    }
  }, []);

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
    if (!startDate || !endDate || !reason) {
      alert('Please fill all fields before requesting OTP.');
      return;
    }
    setShowOtp(true);
  };

  const handleSubmit = async () => {
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }

    const token = localStorage.getItem('token'); // Get JWT token

    if (!token) {
      alert('You must be logged in to submit a rebate request.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/rebate',
        { start_date: startDate, end_date: endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Rebate request submitted successfully!');
      setSubmitted(true);
      localStorage.setItem('rebateEndDate', endDate); // Save end date to restrict further submissions
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit rebate request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="rebate-container">
      <h2 id="rebate-title">🎓 Rebate Management</h2>

      {submitted ? (
        <p id="success-message">✅ You have already submitted a rebate request. Next request allowed after {previousEndDate}.</p>
      ) : (
        <>
          <div id="rebate-form">
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              type="date"
              min={today.toISOString().split('T')[0]}
              max={maxStartDate.toISOString().split('T')[0]}
              value={startDate}
              onChange={handleStartDateChange}
              disabled={submitted}
            />

            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              type="date"
              min={startDate}
              value={endDate}
              onChange={handleEndDateChange}
              disabled={!startDate || submitted}
            />

            <label htmlFor="reason">Reason for Leave:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave..."
              disabled={submitted}
            ></textarea>
          </div>

          {!showOtp && (
            <button id="request-otp-btn" onClick={handleOtpRequest} disabled={!startDate || !endDate || !reason || submitted}>
              Request OTP
            </button>
          )}

          {showOtp && (
            <div id="otp-section">
              <label htmlFor="otp-input">Enter OTP:</label>
              <input id="otp-input" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={submitted} />
              <button id="submit-rebate-btn" onClick={handleSubmit} disabled={loading || submitted}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          )}
        </>
      )}

      <button id="back-btn" onClick={() => navigate('/student')}>Back</button>
    </div>
  );
}

export default RebateManagement;

