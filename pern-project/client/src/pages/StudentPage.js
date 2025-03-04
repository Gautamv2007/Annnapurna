import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

function StudentPage() {
  const navigate = useNavigate();

  return (
    <div id="student-container">
      <h2>🎓 Welcome Student!</h2>
      <div className="student-buttons">
        <button onClick={() => navigate('/student/rebate-management')}>Rebate Management</button>
        <button onClick={() => navigate('/student/live-menu')}>Live Menu</button>
        <button onClick={() => navigate('/student/guest-registration')}>Guest Registration</button>
        <button onClick={() => navigate('/student/wallet-integration')}>Wallet Integration</button>
        <button onClick={() => navigate('/student/review-system')}>Review System</button>
        <button onClick={() => navigate('/student/profile-records')}>View Profile Records</button>
      </div>
    </div>
  );
}

export default StudentPage;
