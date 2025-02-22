import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Homepage from './pages/HomePage';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/Register'; // Import RegisterForm
import AdminPage from './pages/AdminPage';
import MessStaffPage from './pages/MessStaffPage';
import SecurityPage from './pages/SecurityPage';
import StudentPage from './pages/StudentPage';
import MessDashboard from "./pages/MessStaffPage";
import MessMenu from "./pages/MessMenu.js";
import AttendanceEarnings from "./pages/AttendanceEarnings.js";
import Reviews from "./pages/Reviews.js";
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} /> {/* Added Register Route */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mess-staff" element={<MessStaffPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/mess-dashboard" element={<MessDashboard />} />
        <Route path="/mess-menu" element={<MessMenu />} />
        <Route path="/attendance-earnings" element={<AttendanceEarnings />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
