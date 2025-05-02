const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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

    insertMessStaffUser();
    insertSecurityUser();
    insertTestStudents()
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
async function insertTestStudents() {
    try {
        const password = "student123"; // Default password for test students
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, phone, password, username, semester, hostel, room, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        for (let i = 1; i <= 20; i++) {
            const rollNumber = `524cs${String(i).padStart(3, '0')}`;
            const email = `${rollNumber}@iiitk.ac.in`;
            const name = `Test Student ${i}`;
            const phone = `98765${String(10000 + i)}`;
            const username = rollNumber;
            const semester = Math.ceil(i / 5); // Assigning semesters 1-4
            const hostel = `Hostel-${Math.ceil(i / 5)}`;
            const room = String(100 + i);
            const role = "student";

            db.query(sql, [name, email, phone, hashedPassword, username, semester, hostel, room, role], (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        console.log(`User ${username} already exists.`);
                    } else {
                        console.error("Error inserting user:", err);
                    }
                    return;
                }
                console.log(`User ${username} added successfully!`);
            });
        }
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

async function insertSecurityUser() {
    try {
        const password = "security123"; // Change password if needed
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, phone, password, username, semester, hostel, room, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = ["Test Security", "security@example.com", "9876543211", hashedPassword, "security1", 0, "Security", "102", "security"];

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    console.log("Security user already exists.");
                } else {
                    console.error("Error inserting user:", err);
                }
                return;
            }
            console.log("Security user added successfully!");
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
        user: "shikharanu1@gmail.com",
        pass:"tydiypgjlnriuscc"
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

app.post("/verify-otp-guest", async (req, res) => {
    const { email, otp } = req.body;
    const otpEntry = otpStore[email];

    if (!otpEntry || otpEntry.otp !== otp) {
        return res.status(401).json({ error: "Invalid OTP." });
    } else {
        delete otpStore[email];

        res.json({ message: "OTP verified successfully for guest registration" });
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
app.get("/api/rebate/status", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your_secret_key");
    const rollNumber = decoded.roll_number;

    const sql = "SELECT end_date FROM mess_rebate WHERE roll_number = ? ORDER BY id DESC LIMIT 1";
    db.query(sql, [rollNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            res.json({ end_date: result[0].end_date });
        } else {
            res.json({ end_date: null });
        }
    });
});


// Create a new rebate request (with active rebate and date checks)

app.post("/api/rebate", authenticateToken, (req, res) => {
    const { start_date, end_date, reason } = req.body;
    const userId = req.user.id;

    if (!start_date || !end_date || !reason) {
        return res.status(400).json({ error: "Start date, end date, and reason are required." });
    }

    const today = new Date().toISOString().split("T")[0];
    if (start_date < today || end_date < today) {
        return res.status(400).json({ error: "Start date and end date must be in the future." });
    }

    const userQuery = `
        SELECT name, email, username AS roll_number, semester, branch, hostel AS hall_name, room AS room_no, phone AS mobile_number 
        FROM users 
        WHERE id = ?
    `;

    db.query(userQuery, [userId], (userErr, results) => {
        if (userErr || results.length === 0) {
            console.error("User fetch error:", userErr);
            return res.status(500).json({ error: "Error retrieving user details." });
        }

        const { name, email, roll_number, semester, branch, hall_name, room_no, mobile_number } = results[0];

        const overlapCheckQuery = `
            SELECT * FROM mess_rebate 
            WHERE roll_number = ? 
            AND (
                (start_date <= ? AND end_date >= ?)
                OR 
                (start_date >= ? AND start_date <= ?)
            )
        `;

        db.query(overlapCheckQuery, [roll_number, end_date, start_date, start_date, end_date], (overlapErr, overlappingRebates) => {
            if (overlapErr) {
                console.error("Overlap check error:", overlapErr);
                return res.status(500).json({ error: "Error checking overlapping rebates." });
            }

            if (overlappingRebates.length > 0) {
                return res.status(400).json({ error: "The selected date range conflicts with an existing rebate request." });
            }

            const insertQuery = `
                INSERT INTO mess_rebate 
                (start_date, end_date, name, roll_number, semester, branch, hall_name, room_no, mobile_number, reason, period_of_absence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATEDIFF(?, ?))
            `;

            db.query(insertQuery, [start_date, end_date, name, roll_number, semester, branch, hall_name, room_no, mobile_number, reason, end_date, start_date], (insertErr, result) => {
                if (insertErr) {
                    console.error("Insert error:", insertErr);
                    return res.status(500).json({ error: "Failed to submit rebate request." });
                }

                // Return data to the frontend
                const numberOfDays = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;

                return res.status(200).json({
                    name,
                    roll_number,
                    semester,
                    branch,
                    hall_name,
                    room_no,
                    mobile_number,
                    reason,
                    start_date,
                    end_date,
                    total_days: numberOfDays,
                });
            });
        });
    });
});
app.get('/api/rebate/pdf', authenticateToken, (req, res) => {
    const userId = req.user.user;
    console.log("User ID from token:", userId); // Debugging log

    const getUserDetailsQuery = `
        SELECT name, email, username AS roll_number, semester, branch, hostel AS hall_name, room AS room_no, phone AS mobile_number 
        FROM users 
        WHERE id = ?
    `;

    db.query(getUserDetailsQuery, [userId], (userErr, userResults) => {
        if (userErr || userResults.length === 0) {
            return res.status(500).json({ error: "Failed to retrieve user details." });
        }

        const user = userResults[0];

        const getRebateQuery = `
            SELECT * FROM mess_rebate 
            WHERE roll_number = ? 
            ORDER BY id DESC 
            LIMIT 1
        `;

        db.query(getRebateQuery, [user.roll_number], async (rebateErr, rebateResults) => {
            if (rebateErr || rebateResults.length === 0) {
                return res.status(404).json({ error: "No rebate record found." });
            }

            const rebate = rebateResults[0];

            try {
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595, 842]);
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                const { height } = page.getSize();

                const drawText = (text, x, y) => {
                    page.drawText(text, { x, y, size: 12, font });
                };

                drawText("Mess Rebate Form", 230, height - 50);
                drawText(`Date: ${new Date().toLocaleDateString()}`, 420, height - 70);
                drawText(`1. Name of the Student: ${user.name}`, 50, height - 100);
                drawText(`2. Roll Number: ${user.roll_number}`, 50, height - 130);
                drawText(`   Semester: ${user.semester}   Branch: ${user.branch}`, 50, height - 150);
                drawText(`3. Hall Name and Room No.: ${user.hall_name}, ${user.room_no}`, 50, height - 180);
                drawText(`   Mobile Number: ${user.mobile_number}`, 50, height - 200);
                drawText(`4. Reason: ${rebate.reason}`, 50, height - 230);
                drawText(`5. Period of Absence: From ${rebate.start_date} To ${rebate.end_date}`, 50, height - 260);
                drawText(`6. Total No. of Days Leave: ${rebate.number_of_days}`, 50, height - 280);
                drawText("Signature of the student with date", 50, height - 320);

                drawText("For Office Use Only", 50, height - 370);
                drawText("Eligible for mess rebate (Yes/No):", 50, height - 400);
                drawText("Remarks of the Warden:", 50, height - 430);
                drawText("Signature of the Warden", 50, height - 470);
                drawText("Chief Warden", 300, height - 470);

                const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=mess_rebate.pdf');
                res.send(pdfBytes);
            } catch (err) {
                console.error("PDF generation error:", err);
                res.status(500).json({ error: "Failed to generate PDF." });
            }
        });
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
    const { category, staff_name, food_name, meal_day, meal_time, place, review, rating } = req.body;
  
    let sql = `INSERT INTO reviews (category, staff_name, food_name, meal_day, meal_time, place, review, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(
      sql,
      [
        category,
        staff_name || null,
        food_name || null,
        meal_day || null,
        meal_time || null,
        place || null,
        review,
        rating,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting review:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Review added successfully!" });
      }
    );
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
// Fetch pending rebate requests
app.get("/api/rebates/pending", (req, res) => {
    const sql = "SELECT * FROM mess_rebate WHERE status = 'pending'";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Fetch history of rebate requests (approved/rejected)
app.get("/api/rebates/history", (req, res) => {
    const sql = "SELECT * FROM mess_rebate WHERE status != 'pending'";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Fetch user details based on email (security personnel's view)
app.get("/api/user/:email", (req, res) => {
    const email = req.params.email;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]); 
    });
});

// Approve or reject rebate request
app.post("/api/rebates/update", (req, res) => {
    const { id, status } = req.body;

    if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ error: "Invalid status" });
    }

    const updateStatusSql = "UPDATE mess_rebate SET status = ? WHERE id = ?";
    db.query(updateStatusSql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (status === "approved") {
            // Fetch roll_number and number_of_days from mess_rebate
            const getDetailsSql = "SELECT roll_number, number_of_days FROM mess_rebate WHERE id = ?";
            db.query(getDetailsSql, [id], (err, rebateResult) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (rebateResult.length === 0) {
                    return res.status(404).json({ error: "Rebate record not found" });
                }

                const { roll_number, number_of_days } = rebateResult[0];
                const daysToDeduct = number_of_days || 0;

                // Update attendance based on roll_number
                const updateAttendanceSql = "UPDATE users SET attendance = attendance - ? WHERE username = ?";
                db.query(updateAttendanceSql, [daysToDeduct, roll_number], (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: "Rebate updated and attendance deducted successfully." });
                });
            });
        } else {
            res.json({ message: "Rebate request updated successfully." });
        }
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
