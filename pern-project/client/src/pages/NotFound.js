import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const goHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div id="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved. Please check the URL or go to the homepage.
      </p>
      <div className="not-found-buttons">
        <button onClick={goBack}>Go Back</button>
        <button onClick={goHome}>Go to Homepage</button>
      </div>
    </div>
  );
}

export default NotFoundPage;