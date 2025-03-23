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
    password: "1234", // Change this to your MySQL password
    database: "dining_management"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database");

    insertMessStaffUser();
});

// Function to insert a mess staff user
async function insertMessStaffUser() {
    try {
        const password = "messstaff123"; // Change password if needed
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, phone, password, username, semester, hostel, room, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = ["Test Mess Staff", "messstaff@example.com", "9876543210", hashedPassword, "messstaff1", 0, "Mess", "101", "mess_staff"];

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    console.log("Mess staff user already exists.");
                } else {
                    console.error("Error inserting user:", err);
                }
                return;
            }
            console.log("Mess staff user added successfully!");
        });
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

// Create users table if not exists
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

// Create mess_rebate table if not exists
const createMessRebateTable = `
CREATE TABLE IF NOT EXISTS mess_rebate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    branch VARCHAR(50) NOT NULL,
    hall_name VARCHAR(50) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    reason TEXT NOT NULL,
    period_of_absence VARCHAR(100) NOT NULL,
    number_of_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date) + 1) STORED
);
`;

db.query(createMessRebateTable, (err, result) => {
    if (err) console.error("Error creating mess_rebate table:", err);
    else console.log("Mess rebate table checked/created successfully.");
});

// Create messmenu table if not exists
const createMessMenuTable = `
CREATE TABLE IF NOT EXISTS messmenu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') UNIQUE NOT NULL,
    meals JSON NOT NULL
);
`;

db.query(createMessMenuTable, (err, result) => {
    if (err) console.error("Error creating messmenu table:", err);
    else console.log("Mess menu table checked/created successfully.");
});

// Create guestregistration if not exists
const createGuestRegistrationTable = `
CREATE TABLE IF NOT EXISTS guest_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    meals JSON NOT NULL,
    total_bill INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createGuestRegistrationTable, (err, result) => {
    if (err) console.error("Error creating guest_registrations table:", err);
    else console.log("Guest registration table checked/created successfully.");
});


//Create review table in mysql
const createReviewsTable = `
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('Staff', 'Food', 'Cleanliness') NOT NULL,
    staff_name VARCHAR(255),
    food_name VARCHAR(255),
    meal_day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    meal_time ENUM('Morning', 'Afternoon', 'Evening', 'Dinner'),
    place VARCHAR(255),
    review TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createReviewsTable, (err, result) => {
    if (err) console.error("Error creating reviews table:", err);
    else console.log("Reviews table checked/created successfully.");
});

//Attendance system 
const createAttendanceEarningsTable = `
CREATE TABLE IF NOT EXISTS attendance_earnings (
    date DATE PRIMARY KEY,
    students_attended INT NOT NULL,
    cost_per_day INT NOT NULL DEFAULT 109,
    total_earnings INT GENERATED ALWAYS AS (students_attended * cost_per_day) STORED
);
`;

db.query(createAttendanceEarningsTable, (err, result) => {
    if (err) console.error("Error creating attendance_earnings table:", err);
    else console.log("Attendance earnings table checked/created successfully.");
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
        return res.status(401).json({ error: "Invalid OTP." });
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

// Login user
app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required" });
    }

    db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, role: user.role });
    });
});


// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ error: "Invalid token." });
        req.user = user; // Store user details in request
        next();
    });
};


// Submit Rebate Request
app.post("/api/rebate", authenticateToken, (req, res) => {
    const { start_date, end_date, reason } = req.body;
    const userId = req.user.id; // Extract user ID from token

    if (!start_date || !end_date || !reason) {
        return res.status(400).json({ error: "Start date, end date, and reason are required." });
    }

    // Fetch user details from the users table
    const userQuery = "SELECT name, username AS roll_number, semester, hostel AS hall_name, room AS room_no, phone AS mobile_number FROM users WHERE id = ?";
    db.query(userQuery, [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: "Failed to retrieve user details." });
        }

        const { name, roll_number, semester, hall_name, room_no, mobile_number } = results[0];

        // Insert rebate request
        const insertQuery = `
            INSERT INTO mess_rebate (start_date, end_date, name, roll_number, semester, branch, hall_name, room_no, mobile_number, reason, period_of_absence)
            VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, ?, '')
        `;

        db.query(insertQuery, [start_date, end_date, name, roll_number, semester, hall_name, room_no, mobile_number, reason], (insertErr, result) => {
            if (insertErr) return res.status(500).json({ error: "Failed to submit rebate request." });

            res.status(201).json({ message: "Rebate request submitted successfully", rebateId: result.insertId });
        });
    });
});

// Fetch Rebate Requests
app.get("/api/rebate", (req, res) => {
    const query = "SELECT * FROM mess_rebate ORDER BY start_date DESC";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve rebate requests" });

        res.json(results);
    });
});

// Fetch Mess Menu
app.get("/api/messmenu", (req, res) => {
    const query = "SELECT * FROM messmenu ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve mess menu" });

        res.json(results);
    });
});

// Update Mess Menu for a Specific Day
app.post("/api/messmenu", authenticateToken, (req, res) => {
    const { day, meals } = req.body;

    if (!day || !meals) {
        return res.status(400).json({ error: "Day and meals are required." });
    }

    const query = `
        INSERT INTO messmenu (day, meals) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE meals = VALUES(meals);
    `;

    db.query(query, [day, JSON.stringify(meals)], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update mess menu." });

        res.json({ message: `Mess menu updated for ${day}` });
    });
});

// Register a Guest
app.post("/api/register-guest", (req, res) => {
    const { guests } = req.body; // Expecting an array of guests

    if (!guests || guests.length === 0) {
        return res.status(400).json({ error: "Guest details are required." });
    }

    const insertQuery = "INSERT INTO guest_registrations (guest_name, meals, total_bill) VALUES ?";
    const values = guests.map(guest => [guest.name, JSON.stringify(guest.meals), guest.meals.length * 50]);

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error registering guests" });
        }
        res.status(201).json({ message: "Guests registered successfully", insertedRows: result.affectedRows });
    });
});

// Fetch all registered guests
app.get("/api/guests", (req, res) => {
    const query = "SELECT * FROM guest_registrations ORDER BY registration_date DESC";
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve guest registrations" });
        res.json(results);
    });
});

// Fetch Mess Menu
app.get("/api/messmenu", (req, res) => {
    const query = "SELECT * FROM messmenu ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')";
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve mess menu" });
        }

        // Convert meals from JSON string to object
        const formattedResults = results.map(row => ({
            day: row.day,
            meals: JSON.parse(row.meals)
        }));

        res.json(formattedResults);
    });
});

//API to Submit Reviews 
app.post("/api/reviews", (req, res) => {
    const { category, name, rating, review } = req.body;

    // Log request body to check if data is received
    console.log("Received Review Data:", req.body);

    if (!category || !name || !rating || !review) {
        return res.status(400).json({ error: "All fields (category, name, rating, review) are required." });
    }

    const query = `INSERT INTO reviews (category, name, rating, review) VALUES (?, ?, ?, ?)`;

    db.query(query, [category, name, rating, review], (err, result) => {
        if (err) {
            console.error("Error inserting review into MySQL:", err);
            return res.status(500).json({ error: "Failed to submit review." });
        }

        console.log("Review inserted successfully, ID:", result.insertId);
        res.status(201).json({ message: "Review submitted successfully!", reviewId: result.insertId });
    });
});


//API to Fetch all reviews
app.get("/api/reviews", (req, res) => {
    const query = "SELECT * FROM reviews ORDER BY created_at DESC";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Error retrieving reviews." });

        res.json(results);
    });
});

// Fetch Rebate History
app.get("/api/rebate", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = "SELECT start_date, end_date, status FROM mess_rebate WHERE roll_number = (SELECT username FROM users WHERE id = ?) ORDER BY start_date DESC";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve rebates" });
        res.json(results);
    });
});

// Fetch Guest Registrations
app.get("/api/guests", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = "SELECT guest_name, meals, registration_date, status FROM guest_registrations WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve guests" });
        res.json(results);
    });
});

// Fetch Payment Transactions
app.get("/api/payments", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = "SELECT date, amount, type FROM payments WHERE user_id = ? ORDER BY date DESC";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve payments" });
        res.json(results);
    });
});

// Fetch User Reviews
app.get("/api/reviews", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = "SELECT category, review, rating FROM reviews WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve reviews" });
        res.json(results);
    });
});

//Update mess menu
app.post("/api/update-messmenu", (req, res) => {
    const { day, meals } = req.body;

    if (!day || !meals) {
        return res.status(400).json({ error: "Day and meals data are required." });
    }

    const query = `
        INSERT INTO messmenu (day, meals) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE meals = VALUES(meals);
    `;

    db.query(query, [day, JSON.stringify(meals)], (err, result) => {
        if (err) {
            console.error("Error updating mess menu:", err);
            return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ message: `Mess menu updated successfully for ${day}` });
    });
});

//Fetch reviews
app.get("/api/reviews", (req, res) => {
    const query = `
        SELECT id, 
               category, 
               name, 
               DATE(created_at) AS formatted_date
        FROM reviews
        ORDER BY created_at DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving reviews:", err);
            return res.status(500).json({ error: "Failed to retrieve reviews" });
        }

        console.log("Fetched reviews from database:", results);  // 🔍 Debugging log
        res.json(results);
    });
});

//Resolve a review
app.post("/api/resolve-review", (req, res) => {
    const { id, comment } = req.body;

    const query = "DELETE FROM reviews WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to resolve review" });

        res.json({ message: "Review resolved successfully", comment });
    });
});

//Fetch and calculate the attendance
app.get("/api/attendance", (req, res) => {
    const query = `
        SELECT COUNT(*) AS rebate_students
        FROM mess_rebate
        WHERE CURDATE() BETWEEN start_date AND end_date;
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch attendance data" });

        const rebate_students = result[0].rebate_students;
        const students_attended = 700 - rebate_students;
        const cost_per_day = 109;
        const total_earnings = students_attended * cost_per_day;

        console.log(`Rebate Students: ${rebate_students}, Students Attended: ${students_attended}`);

        res.json({ date: new Date().toISOString().split("T")[0], students_attended, cost_per_day, total_earnings });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
