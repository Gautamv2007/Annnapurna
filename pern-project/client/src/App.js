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
import Profile from "./pages/Profile.js";
import RebateManagement from "./pages/RebateManagement.js";
import LiveMenu from "./pages/LiveMenu.js";
import GuestRegistration from "./pages/GuestRegistration.js";
import StudentReviewSystem from "./pages/StudentReviewSystem.js";
import Footer from './components/Footer';
import ProfileStudent from "./pages/profile_student";
import Outpass from "./pages/OutPass.js"; // Import Outpass Page
import NotFoundPage from './pages/NotFound'; // Import 404 Page
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/student/rebate-management" element={<RebateManagement />} />
        <Route path="/student/live-menu" element={<LiveMenu />} />
        <Route path="/student/guest-registration" element={<GuestRegistration />} />
        <Route path="/student/review-system" element={<StudentReviewSystem />} />
        <Route path="/student/profile-records" element={<ProfileStudent />} />
        <Route path="/student/outpass" element={<Outpass />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 Page Route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;