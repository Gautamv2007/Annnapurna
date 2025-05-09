import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import './Student.css';

function StudentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyRole = async () => {
      const storedRole = localStorage.getItem('role');
      if (!storedRole) {
        navigate('/404', { replace: true });
        return;
      }

      const isMatch = await bcrypt.compare('student', storedRole);
      if (!isMatch) {
        navigate('/404', { replace: true });
      }
    };

    verifyRole();
  }, [navigate]);

  return (
    <div id="student-container">
      <h2>🎓 Welcome Student!</h2>
      <div className="student-buttons">
        <button onClick={() => navigate('/student/outpass')}>Request OutPass</button>
        <button onClick={() => navigate('/student/rebate-management')}>Rebate Management</button>
        <button onClick={() => navigate('/student/live-menu')}>Live Menu</button>
        <button onClick={() => navigate('/student/guest-registration')}>Guest Registration</button>
        <button onClick={() => navigate('/student/review-system')}>Review System</button>
        <button onClick={() => navigate('/student/profile-records')}>View Profile Records</button>
      </div>
    </div>
  );
}

export default StudentPage;