import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge, FaBuilding, FaHashtag, FaCamera } from "react-icons/fa";
import "./Register.css";
import Footer from "../Footer.js";

function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [semester, setSemester] = useState("");
  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");
  const [otp, setOtp] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);

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
          if (roomNum>=1 && roomNum<10) {
            rooms.push(`${floor}0${roomNum}`);
          }else{
            rooms.push(`${floor}${roomNum}`);
          }
        }
      }
    } else if (selectedHostel === "Kalam") {
      for (let floor = 1; floor <= 4; floor++) {
        for (let roomNum = 1; roomNum <= 30; roomNum++) {
          if (roomNum>=1 && roomNum<10) {
            rooms.push(`${floor}0${roomNum}A`);
            rooms.push(`${floor}0${roomNum}B`);
          }else{
            rooms.push(`${floor}${roomNum}A`);
            rooms.push(`${floor}${roomNum}B`);
          }
        }
      }
    } else if (selectedHostel === "MVHR" || selectedHostel === "Kalpana Chawla Hall") {
      for (let floor = 1; floor <= 9; floor++) {
        for (let roomNum = 1; roomNum <= 30; roomNum++) {
          if (roomNum>=1 && roomNum<10) {
            rooms.push(`${floor}0${roomNum}A`);
            rooms.push(`${floor}0${roomNum}B`);
          }else{
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registered Successfully!");
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create an Account</h2>
        <p className="subtext">Fill in the details to register</p>

        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-group">
            <label><FaCamera className="icon" /> Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} required />
          </div>

          <div className="form-group">
            <label><FaHashtag className="icon" /> Email OTP</label>
            <input type="text" placeholder="Enter 6-digit OTP" pattern="\d{6}" title="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>

        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default RegisterForm;
