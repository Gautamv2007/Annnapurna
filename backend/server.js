const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

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
});

// Create tables if not exist
// Create users table
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff') NOT NULL
);
`;

db.query(createUsersTable, (err, result) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table checked/created successfully.");
});

// Create reservations table
const createReservationsTable = `
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    guests INT NOT NULL,
    time DATETIME NOT NULL
);
`;

db.query(createReservationsTable, (err, result) => {
    if (err) console.error("Error creating reservations table:", err);
    else console.log("Reservations table checked/created successfully.");
});


// Register User
app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "User registered", id: result.insertId });
        }
    });
});

// Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";
    
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token, role: user.role });
    });
});


// Get all students
app.get("/students", (req, res) => {
    const query = "SELECT id, name, email FROM users WHERE role = 'student'";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Get all mess staff
app.get("/staff", (req, res) => {
    const query = "SELECT id, name, email FROM users WHERE role = 'staff'";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Get reservations
app.get("/reservations", (req, res) => {
    db.query("SELECT * FROM reservations", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Add reservation
app.post("/reservations", (req, res) => {
    const { name, phone, guests, time } = req.body;
    const query = "INSERT INTO reservations (name, phone, guests, time) VALUES (?, ?, ?, ?)";
    db.query(query, [name, phone, guests, time], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Reservation added", id: result.insertId });
        }
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

