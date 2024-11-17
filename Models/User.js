const connection = require('../Config');
const jwt = require('jsonwebtoken');

const secretKey = 'uygyjgyukg'; // Ideally, store this in environment variables

// Register function
const register = (user, callback) => {
    const { name, email, password } = user;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    connection.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error registering user:", err);
            callback({ message: "Error registering user", error: err }, null);
        } else {
            callback(null, { message: "User registered successfully", result });
        }
    });
};

// Login function
const login = (user, callback) => {
    const { email, password } = user;
    const sql = "SELECT * FROM users WHERE email = ?";
    
    connection.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Error retrieving user:", err);
            callback({ message: "Error retrieving user", error: err }, null);
        } else if (result.length === 0 || result[0].password !== password) {
            // If no user is found or password does not match
            console.log("Invalid credentials");
            callback({ message: "Invalid credentials" }, null);
        } else {
            const user = result[0];

            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                secretKey,
                { expiresIn: '1h' }
            );

            console.log("Login Successful");

            // Return the token and user information
            callback(null, {
                message: "Login successful",
                token: token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        }
    });
};


const data = (callback,req,res) => {
    const id = req.params
    const sql = `SELECT * FROM files where id=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching users:", err);
            callback({ message: "Error fetching data", error: err }, null);
        } else {
            callback(null, result);
            
        }
    });
};
const forgot=(callback,req,res)=>{

    const  email = req.body.email

    const sql = `select * from users where email=?`;
    connection.query(sql,email,(err,result)=>{
        if (err) {
            console.error("Error fetching users:", err);
            callback({ message: "Error fetching data", error: err }, null);
        } else {
            callback(null, result);
            
        }
    })

}

const update =(user,callback)=>{

    const {name,email,password} = user;
    const sql ="update  users set password  =? where email=? ";

    connection.query(sql,[password,email],(err,result)=>{
        if (err) {
            console.error("Error fetching users:", err);
            callback({ message: "Error fetching data", error: err }, null);
        } else {
            callback(null, result);
            
        }
    })
}






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


  
    


const getappointments = (callback)=>{
    const sql ="select * from appointments where iscompleted =1"

    connection.query(sql,(err,result)=>{
        if (err) {
            console.error("Error fetching users:", err);
            callback({ message: "Error fetching data", error: err }, null);
        } else {
            callback(null, result);
            
        }
    })
}

const mysql = require("mysql2/promise");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Yash@208",
  database: "crm",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const startTransaction = async (connection) => {
  await connection.query("START TRANSACTION;");
};

const commitTransaction = async (connection) => {
  await connection.query("COMMIT;");
};

const rollbackTransaction = async (connection) => {
  await connection.query("ROLLBACK;");
};

const appointments = async (patient) => {
  const { patient_id, name, appointment_time, status } = patient;
  console.log(patient);

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION'); // Begin the transaction

    // 1. Fetch the doctor ID
    const [doctorResult] = await connection.query(
      'SELECT doctor_id FROM doctors WHERE name = ? AND status = "ACTIVE";',
      [name]
    );

    if (doctorResult.length === 0) {
      throw new Error("No active doctor found with the given name.");
    }
    const doctorId = doctorResult[0].doctor_id;

    // 2. Fetch an available slot
    const [slotResult] = await connection.query(
      `SELECT slot_id, current_bookings, capacity 
       FROM timeslots 
       WHERE doctor_id = ? AND status = "AVAILABLE" AND current_bookings < capacity 
       LIMIT 1 FOR UPDATE;`,
      [doctorId]
    );

    if (slotResult.length === 0) {
      throw new Error("No available slots for the selected doctor.");
    }

    const { slot_id: slotId, current_bookings, capacity } = slotResult[0];

    // 3. Increment current bookings and update the slot status if necessary
    const newBookings = current_bookings + 1;
    const newStatus = newBookings >= capacity ? "BOOKED" : "AVAILABLE";

    await connection.query(
      `UPDATE timeslots 
       SET current_bookings = ?, status = ? 
       WHERE slot_id = ?;`,
      [newBookings, newStatus, slotId]
    );

    // 4. Create the appointment
    await connection.query(
      `INSERT INTO appointments (patient_id, slot_id,doctor_id, appointment_time, status) 
       VALUES (?, ?, ?, ? ,?);`,
      [patient_id, slotId, doctorId, appointment_time, status]
    );

    await connection.query('COMMIT'); // Commit the transaction
    console.log("Appointment successfully created!");
  } catch (err) {
    console.error("Error handling appointment:", err.message);
    if (connection) await connection.query('ROLLBACK'); // Rollback on error
    throw err;
  } finally {
    if (connection) connection.release(); // Release the connection
  }
};



const UpdateAppointmentStatus = async (req, res) => {
  const { appointment_id, status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE appointment 
       SET status = ?, updated_at = NOW() 
       WHERE appointment_id = ?;`,
      [status, appointment_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment status updated successfully." });
  } catch (err) {
    console.error("Error updating appointment status:", err.message);
    res.status(500).json({ message: "Failed to update appointment status.", error: err.message });
  }
};



const cancelAppointment = async (appointment_id) => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    // Get the slot_id of the appointment
    const [appointment] = await connection.query(
      `SELECT slot_id 
       FROM appointments 
       WHERE appointment_id = ? FOR UPDATE;`,
      [appointment_id]
    );

    if (!appointment.length) {
      throw new Error("Appointment not found.");
    }

    const slot_id = appointment[0].slot_id;

    // Delete the appointment
    await connection.query(
      `DELETE FROM appointments 
       WHERE appointment_id = ?;`,
      [appointment_id]
    );

    // Free the slot
    await freeSlot(slot_id);

    await connection.query('COMMIT');
    return { message: "Appointment canceled successfully." };
  } catch (err) {
    if (connection) await connection.query('ROLLBACK');
    throw err;
  } finally {
    if (connection) connection.release();
  }
};


    // Free the slot
    const freeSlot = async (slot_id) => {
      let connection;
    
      try {
        connection = await pool.getConnection();
        await connection.query('START TRANSACTION');
    
        // Check current bookings for the slot
        const [slot] = await connection.query(
          `SELECT current_bookings 
           FROM timeslots 
           WHERE slot_id = ? FOR UPDATE;`,
          [slot_id]
        );
    
        if (!slot.length) {
          throw new Error("Slot not found.");
        }
    
        const { current_bookings } = slot[0];
        if (current_bookings <= 0) {
          throw new Error("Slot is already free.");
        }
    
        // Decrement current bookings and update status
        const newBookings = current_bookings - 1;
        const newStatus = 'AVAILABLE';
    
        await connection.query(
          `UPDATE timeslots 
           SET current_bookings = ?, status = ? 
           WHERE slot_id = ?;`,
          [newBookings, newStatus, slot_id]
        );
    
        await connection.query('COMMIT');
        return { message: "Slot freed successfully." };
      } catch (err) {
        if (connection) await connection.query('ROLLBACK');
        throw err;
      } finally {
        if (connection) connection.release();
      }
    };
    
  

// const demo=(patient)=>{
//     const { patient_id, doctor_id, appointment_date, appointment_time, status, notes } = patient;
// }
module.exports = { register, login, data,forgot,update,appointments,getappointments,freeSlot,cancelAppointment};
