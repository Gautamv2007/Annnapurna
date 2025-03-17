import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge, FaBuilding, FaHashtag } from "react-icons/fa";
import "./Register.css";
import axios from 'axios'; // Import axios for making API requests

function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [semester, setSemester] = useState("");
  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");
  const [otp, setOtp] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const [retries, setRetries] = useState(0); // State to track OTP retries
  const [loading, setLoading] = useState(false); // State to track loading

  const handleRollChange = (e) => {
    const roll = e.target.value;
    setUsername(roll);
    if (/^\d{3}[a-zA-Z]{2}\d{4}$/.test(roll)) {
      setEmail(`${roll}@iiitk.ac.in`);
    } else {
      setEmail("");
    }
  };

  const generateRooms = (selectedHostel) => {
    let rooms = [];
    if (selectedHostel === "SRKH") {
      for (let floor = 1; floor <= 3; floor++) {
        for (let roomNum = 1; roomNum <= 16; roomNum++) {
          if (roomNum >= 1 && roomNum < 10) {
            rooms.push(`${floor}0${roomNum}`);
          } else {
            rooms.push(`${floor}${roomNum}`);
          }
        }
      }
    } else if (selectedHostel === "Kalam") {
      for (let floor = 1; floor <= 4; floor++) {
        for (let roomNum = 1; roomNum <= 30; roomNum++) {
          if (roomNum >= 1 && roomNum < 10) {
            rooms.push(`${floor}0${roomNum}A`);
            rooms.push(`${floor}0${roomNum}B`);
          } else {
            rooms.push(`${floor}${roomNum}A`);
            rooms.push(`${floor}${roomNum}B`);
          }
        }
      }
    } else if (selectedHostel === "MVHR" || selectedHostel === "Kalpana Chawla Hall") {
      for (let floor = 1; floor <= 9; floor++) {
        for (let roomNum = 1; roomNum <= 30; roomNum++) {
          if (roomNum >= 1 && roomNum < 10) {
            rooms.push(`${floor}0${roomNum}A`);
            rooms.push(`${floor}0${roomNum}B`);
          } else {
            rooms.push(`${floor}${roomNum}A`);
            rooms.push(`${floor}${roomNum}B`);
          }
        }
      }
    }
    return rooms;
  };

  const handleHostelChange = (e) => {
    const selectedHostel = e.target.value;
    setHostel(selectedHostel);
    setRoom("");
    setRoomOptions(generateRooms(selectedHostel));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    const formData = {
      email,
    };

    try {
      await axios.post('http://localhost:5000/send-otp', formData);
      alert("OTP sent to your email.");
      setOtpSent(true); // Set OTP sent state to true
    } catch (error) {
      alert("Failed to send OTP: " + error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpData = { name, email, phone, password, username, semester, hostel, room, otp };
    try {
      await axios.post('http://localhost:5000/verify-otp', otpData);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (error) {
      setRetries(retries + 1);
      if (retries >= 3) {
        alert("Maximum retries reached. Resending OTP.");
        setRetries(0);
        handleRegister(e);
      } else {
        alert("OTP verification failed: " + error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create an Account</h2>
        <p className="subtext">Fill in the details to register</p>

        {loading && <div className="loader">Processing...</div>}

        {!otpSent ? (
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label><FaUser className="icon" /> Name</label>
              <input type="text" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><FaIdBadge className="icon" /> Roll Number</label>
              <input type="text" placeholder="Enter Institute Roll Number" value={username} onChange={handleRollChange} pattern="^\d{3}[a-zA-Z]{2}\d{4}$" title="Format: 524cs0003" required />
            </div>

            <div className="form-group">
              <label><FaEnvelope className="icon" /> Official Email</label>
              <input type="email" value={email} readOnly required />
            </div>

            <div className="form-group">
              <label><FaPhone className="icon" /> Phone Number</label>
              <input type="tel" placeholder="+91-9999999999" pattern="\+91-[0-9]{10}" title="Format: +91-9999999999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><FaBuilding className="icon" /> Hostel Name</label>
              <select value={hostel} onChange={handleHostelChange} required>
                <option value="">--Select Hostel--</option>
                <option value="SRKH">SRKH</option>
                <option value="Kalam">Kalam</option>
                <option value="MVHR">MVHR Hostel</option>
                <option value="Kalpana Chawla Hall">Kalpana Chawla Hall</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaHashtag className="icon" /> Room Number</label>
              <select value={room} onChange={(e) => setRoom(e.target.value)} required>
                <option value="">--Select Room--</option>
                {roomOptions.map((roomOption, index) => (
                  <option key={index} value={roomOption}>{roomOption}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><FaIdBadge className="icon" /> Semester</label>
              <input type="number" min="1" max="10" placeholder="Enter Semester" value={semester} onChange={(e) => setSemester(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><FaLock className="icon" /> Password</label>
              <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label><FaLock className="icon" /> Confirm Password</label>
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" className="register-btn" disabled={loading}>Register</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="otp-form">
            <div className="form-group">
              <label><FaHashtag className="icon" /> Email OTP</label>
              <input type="text" placeholder="Enter 6-digit OTP" pattern="\d{6}" title="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="verify-btn" disabled={loading}>
              {retries >= 3 ? "Resend OTP" : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default RegisterForm;