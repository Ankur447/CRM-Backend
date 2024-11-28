const { response } = require('express');
const connection = require('../Config');
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());
const secretKey = 'uygyjgyukg'; // Ideally, store this in environment variables

connection.on('connect', () => {
  console.log('Connected to the database');
});

// Register function
const register = async (user) => {
  const   { name, email, password } =  user;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  console.log(name);
  
  try {
    const [result] = await  connection.query(sql, [name, email, password]);
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

    if (fetchedUser.password === password) {
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


//   const jappointments = (Patient) => {
//     const { patient_id, doctor_id, appointment_date, appointment_time, status, notes } = Patient;
//     console.log("Received Patient Data:", appointment_date);  // Log the received patient data

//     // Establish the queue (this part should be outside the function, assuming you want a global queue)
//     const waitingQueue = new Queue();
    
//     // Add patient to the queue
//     waitingQueue.enqueue(Patient);
//     console.log(`Patient with ID ${Patient.patient_id} added to waiting queue.`);

//     // Process queue to assign available slots to waiting patients
//     const processQueue = () => {
//         const checkSlotsSql = "SELECT * FROM appointments WHERE iscompleted = 1"; // Assuming iscompleted=1 means available slots

//         connection.query(checkSlotsSql, (err, availableSlots) => {
//             if (err) {
//                 console.error("Error checking slots:", err);
//                 return;
//             }

//             if (availableSlots.length > 0 && !waitingQueue.isEmpty()) {
//                 // Dequeue patient and assign an available slot
//                 const patientFromQueue = waitingQueue.dequeue();

//                 const assignSlotSql = `
//                     INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes)
//                     VALUES (?, ?, ?, ?, ?, ?)
//                 `;

//                 connection.query(
//                     assignSlotSql,
//                     [
//                         patientFromQueue.patient_id,
//                         patientFromQueue.doctor_id,
//                         patientFromQueue.appointment_date,
//                         patientFromQueue.appointment_time,
//                         patientFromQueue.status,
//                         patientFromQueue.notes
//                     ],
//                     (err) => {
//                         if (err) {
//                             console.error("Error assigning slot:", err);
//                             return;
//                         }
//                         else{
//                             console.log(`Assigned slot to patient with ID ${patientFromQueue.patient_id}.`);
//                         }       
                       
//                     }
//                 );
//             }
//         });
//     };


  
    

    // Run queue processing every 5 seconds
   // setInterval(processQueue, 500);


  
    


const getappointments = ()=>{
    const sql ="select * from appointments where iscompleted =1"

    connection.query(sql,(err,result)=>{
          
    })
}




const startTransaction = async (connection) => {
  await connection.query("START TRANSACTION;");
};
 
const commitTransaction = async (connection) => {
  await connection.query("COMMIT;");
};

const rollbackTransaction = async (connection) => {
  await connection.query("ROLLBACK;");
};



// const demo=(patient)=>{
//     const { patient_id, doctor_id, appointment_date, appointment_time, status, notes } = patient;
// }
module.exports = { register, login, data,forgot,update};
