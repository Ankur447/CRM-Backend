const { response } = require('express');
const connection = require('../Config');
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());
const secretKey = 'nigga'; // Ideally, store this in environment variables

connection.on('connect', () => {
  console.log('Connected to the database');
});

// Register function
const bcrypt = require('bcrypt');

const register = async (user) => {
  const { name, email, password } = user;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  console.log(name);

  try {
    // Hash the password with a salt (default is 10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(sql, [name, email, hashedPassword]);
    return { message: "User registered successfully", result };
  } catch (err) {
    return { status: 500, message: "Error registering user", error: err };
  }
};


// Login function
const login = async (user) => {
  const { email, password } = user;
  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const [results] = await connection.query(sql, [email]);

    if (results.length === 0) {
      return { status: 404, message: "User not found" };
    }

    const fetchedUser = results[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, fetchedUser.password);

    if (isPasswordValid) {
      return { status: 200, message: "Logged in successfully", user: fetchedUser };
    } else {
      return { status: 401, message: "Incorrect password" };
    }
  } catch (err) {
    return { status: 500, message: "Error logging in", error: err };
  }
};

// Data fetching function
const data = async (id) => {
  const sql = `SELECT * FROM files WHERE id = ?`;

  try {
    const [result] = await connection.query(sql, [id]);
    return { status: 200, result };
  } catch (err) {
    return { status: 500, message: "Error fetching data", error: err };
  }
};

// Forgot password function
const forgot = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;

  try {
    const [result] = await connection.query(sql, [email]);

    if (result.length === 0) {
      return { status: 404, message: "Email not found" };
    }

    return { status: 200, result };
  } catch (err) {
    return { status: 500, message: "Error fetching user", error: err };
  }
};

// Update password function
const update = async (user) => {
  const { email, password } = user;
  const sql = "UPDATE users SET password = ? WHERE email = ?";

  try {
    const [result] = await connection.query(sql, [password, email]);

    if (result.affectedRows === 0) {
      return { status: 404, message: "Email not found" };
    }

    return { status: 200, message: "Password updated successfully" };
  } catch (err) {
    return { status: 500, message: "Error updating password", error: err };
  }
};






class Queue {
    constructor() {
      this.items = [];
    }
  
    // Enqueue: Add item to the end of the queue
    enqueue(item) {
      this.items.push(item);
    }
  
    // Dequeue: Remove item from the front of the queue
    dequeue() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items.shift();
    }
  
    // Peek: Get the front item without removing it
    peek() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items[0];
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Get the size of the queue
    size() {
      return this.items.length;
    }
  }

 

const upcomingAppointments = async (id) => {
  const sql = 'SELECT patient_id FROM patients WHERE user_id = ?';
  const sql2 = 'SELECT * FROM appointments WHERE patient_id IN (?)';

  try {
    // Fetch patient_ids for the given user_id
    const [patientIdsResult] = await connection.query(sql, [id]);
    const patientIds = patientIdsResult.map(row => row.patient_id);

    if (patientIds.length === 0) {
      return { message: "No patients found for this user", result: [] };
    }

    // Fetch appointments for the patient_ids
    const [appointmentsResult] = await connection.query(sql2, [patientIds]);

    return { message: "Appointments fetched successfully", result: appointmentsResult };
  } catch (err) {
    return { status: 500, message: "Error fetching upcoming appointments", error: err };
  }
};

module.exports = { upcomingAppointments };



module.exports = { register, login, data,forgot,update,upcomingAppointments};
