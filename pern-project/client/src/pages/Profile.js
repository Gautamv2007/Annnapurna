import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const [photo, setPhoto] = useState(null);
  const [showPasswordOptions, setShowPasswordOptions] = useState(false);
  const [changePasswordMethod, setChangePasswordMethod] = useState(""); // "oldPassword" or "emailOTP"

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Display selected image
    }
  };

  return (
    <div id="profile-container">
      <h2 id="profile-title">👤 Profile</h2>

      {/* Profile Image */}
      <div id="profile-image">
        <img src={photo || "https://via.placeholder.com/150"} alt="Profile" />
        <label id="change-photo">
          Change Photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
      </div>

      {/* User Details */}
      <div id="profile-details">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Semester:</strong> 4</p>
        <p><strong>Phone Number:</strong> +91 9876543210</p>
        <p><strong>Role:</strong> Student</p>
      </div>

      {/* Change Password Button */}
      <button id="change-password-btn" onClick={() => setShowPasswordOptions(!showPasswordOptions)}>
        Change Password
      </button>

      {/* Change Password Options */}
      {showPasswordOptions && (
        <div id="password-options">
          <label>
            <input
              type="radio"
              name="passwordMethod"
              value="oldPassword"
              onChange={() => setChangePasswordMethod("oldPassword")}
            />
            Change via Old Password
          </label>
          <label>
            <input
              type="radio"
              name="passwordMethod"
              value="emailOTP"
              onChange={() => setChangePasswordMethod("emailOTP")}
            />
            Reset via Email OTP
          </label>

          {/* Form for changing via Old Password */}
          {changePasswordMethod === "oldPassword" && (
            <div id="password-form">
              <input type="password" placeholder="Enter Old Password" />
              <input type="password" placeholder="Enter New Password" />
              <input type="password" placeholder="Confirm New Password" />
              <button id="update-password-btn">Update Password</button>
            </div>
          )}

          {/* Form for resetting via Email OTP */}
          {changePasswordMethod === "emailOTP" && (
            <div id="otp-form">
              <input type="email" placeholder="Enter Email" />
              <button id="send-otp-btn">Send OTP</button>
              <input type="text" placeholder="Enter OTP" />
              <input type="password" placeholder="Enter New Password" />
              <button id="reset-password-btn">Reset Password</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
