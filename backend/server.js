const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", // Change this to your MySQL password
    database: "dining_management"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database");
});

// Create tables if not exist
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    semester INT NOT NULL,
    hostel VARCHAR(255) NOT NULL,
    room VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff') NOT NULL
);
`;

db.query(createUsersTable, (err, result) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table checked/created successfully.");
});

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to generate a random OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// In-memory store for OTPs
const otpStore = {};

// Send OTP
app.post("/send-otp", (req, res) => {
    const { email } = req.body;
    const otp = generateOtp();
    otpStore[email] = { otp, retries: 0 };

    // Send OTP email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Registration',
        text: `Your OTP for registration is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending OTP email:", error);
            return res.status(500).json({ error: "Error sending OTP email" });
        }
        console.log('Email sent: ' + info.response);
        res.json({ message: "OTP sent to email" });
    });
});

// Verify OTP and Register User
app.post("/verify-otp", async (req, res) => {
    const { name, email, phone, password, username, semester, hostel, room, otp } = req.body;
    const otpEntry = otpStore[email];

    if (!otpEntry || otpEntry.otp !== otp) {
        if (otpEntry) {
            otpEntry.retries += 1;
            if (otpEntry.retries >= 3) {
                // Resend OTP
                const newOtp = generateOtp();
                otpStore[email] = { otp: newOtp, retries: 0 };

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your OTP for Registration',
                    text: `Your OTP for registration is ${newOtp}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending OTP email:", error);
                        return res.status(500).json({ error: "Error sending OTP email" });
                    }
                    console.log('Email sent: ' + info.response);
                    return res.status(401).json({ error: "OTP expired. New OTP sent to email." });
                });
            } else {
                return res.status(401).json({ error: `Invalid OTP. You have ${3 - otpEntry.retries} attempts left.` });
            }
        } else {
            return res.status(401).json({ error: "Invalid OTP." });
        }
    } else {
        // OTP is valid, save user data and clear OTP entry
        delete otpStore[email];
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, email, phone, password, username, semester, hostel, room, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'student')";
        db.query(query, [name, email, phone, hashedPassword, username, semester, hostel, room], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "OTP verified, registration complete" });
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});