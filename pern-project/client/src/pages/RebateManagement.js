import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Library for generating PDFs
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

  // Fetch rebate status from backend
  useEffect(() => {
    const fetchRebateStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/rebate/status', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.end_date) {
          setPreviousEndDate(response.data.end_date);
          setSubmitted(true);
        } else {
          setSubmitted(false);
        }
      } catch (error) {
        console.error('Error fetching rebate status:', error);
        setSubmitted(false);
      }
    };

    fetchRebateStatus();
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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a rebate request.');
      return;
    }

    if (!startDate || !endDate || !reason) {
      alert('Please fill in all the fields before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/rebate',
        { start_date: startDate, end_date: endDate, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Generate PDF using jsPDF with the response data
      generatePDF(response.data);
      alert('Rebate request submitted successfully! PDF downloaded.');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rebate request:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit rebate request.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (data) => {
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth(); // Get the width of the page

    // Add Title for Institute Name (center-aligned and split into two lines)
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(14); // Font size adjusted to fit the page
    pdf.setTextColor(0, 0, 128); // Dark blue color

    pdf.text("INDIAN INSTITUTE OF INFORMATION TECHNOLOGY,", pageWidth / 2, 20, { align: "center" });
    pdf.text("DESIGN AND MANUFACTURING KURNOOL", pageWidth / 2, 30, { align: "center" });

    // Add Form Title (center-aligned)
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0); // Black color
    pdf.text("Mess Rebate Form", pageWidth / 2, 40, { align: "center" });

    // Add horizontal line
    pdf.setDrawColor(0, 0, 0); // Black color for line
    pdf.line(10, 45, 200, 45); 

    // Add Date
    pdf.setFont("Arial", "normal");
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 15, 65);

    // Add Student Details Section
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(12);
    pdf.text("1. Student Details", pageWidth / 2, 55, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${data.name}`, 20, 75);
    pdf.text(`Roll Number: ${data.roll_number}`, 20, 85);
    pdf.text(`Semester: ${data.semester}`, 20, 95);
    pdf.text(`Branch: ${data.branch}`, 20, 105);
    pdf.text(`Hall Name and Room No.: ${data.hall_name}, ${data.room_no}`, 20, 115);
    pdf.text(`Mobile Number: ${data.mobile_number}`, 20, 125);

    // Add horizontal line
    pdf.line(10, 130, 200, 130);

    // Add Leave Details Section
    pdf.setFont("Arial", "bold");
    pdf.text("2. Leave Details", pageWidth / 2, 140, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.text(`Reason: ${data.reason}`, 20, 150);
    pdf.text(`Period of Absence: From ${data.start_date} To ${data.end_date}`, 20, 160);
    pdf.text(`Total No. of Days Leave: ${data.total_days}`, 20, 170);

    // Add horizontal line
    pdf.line(10, 175, 200, 175);

    // Add Signature Section
    pdf.setFont("Arial", "bold");
    pdf.text("3. Signature Section", pageWidth / 2, 185, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.text("Signature of the student with date: ______________________", 20, 195);
    pdf.text("For Office Use Only:", pageWidth / 2, 205, { align: "center" });
    pdf.text("Eligible for mess rebate (Yes/No): ______________________", 20, 215);
    pdf.text("Remarks of the Warden: _______________________________", 20, 225);
    pdf.text("Signature of the Warden: _____________________________", 20, 235);

    // Add Footer
    pdf.setFont("Arial", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100); // Gray color
    pdf.text("Generated by IIITDM Kurnool Mess Rebate System", 10, 290);

    // Save the PDF
    pdf.save("mess_rebate.pdf");
};
  return (
    <div id="rebate-container">
      <h2 id="rebate-title">🎓 Rebate Management</h2>

      {submitted ? (
        <p id="success-message">✅ You have successfully submitted the rebate request.</p>
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
            <button
              id="request-otp-btn"
              onClick={handleOtpRequest}
              disabled={!startDate || !endDate || !reason || submitted}
            >
              Enter Captcha
            </button>
          )}

          {showOtp && (
            <div id="otp-section">
              <label htmlFor="otp-input">Enter 123456 for verification:</label>
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