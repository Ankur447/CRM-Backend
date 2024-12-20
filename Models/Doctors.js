
const { use } = require('razor');
const connection = require('../Config')
const appointment = require ('./Appointments')
const bcrypt = require('bcrypt');



const toggledoctorStatus= async (id) => {
    const query = `
        UPDATE doctors
        SET status = CASE 
                        WHEN status = 'ACTIVE' THEN 'INACTIVE' 
                        ELSE 'ACTIVE' 
                     END
        WHERE doctor_id = ?
    `;

    const [result] = await connection.execute(query, [id]);

    // Check if any rows were updated
    return result.affectedRows > 0;
};

const getDoctorInfo  = async (id)=>{
    const sql = 'select name , status from doctors where doctor_id=?';

    const [result] = await connection.execute(sql,[id]);
    return result;
}


const getallDoctors  = async ()=>{
  const sql = 'select * from doctors;';

  const [result] = await connection.execute(sql);
  return result;
}

const doctorRgeisteration = async (doctor) => {
  const { name, email, password, specialty, status } = doctor;

  // Input validation
  if (!name || !email || !password) {
    return { status: 400, message: "Name, email, and password are required." };
  }

  // Define the SQL query
  const sql = `
    INSERT INTO doctors (name, email, password, specialty, status) 
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the doctor into the database
    const [result] = await connection.query(sql, [
      name,
      email,
      hashedPassword,
      specialty || null, // Use NULL if no specialty is provided
      status || "ACTIVE", // Default to "ACTIVE" if status is not provided
    ]);

    return { status: 201, message: "Doctor registered successfully", result };
  } catch (err) {
    // Handle duplicate email error
    if (err.code === "ER_DUP_ENTRY") {
      return { status: 409, message: "Email already exists." };
    }

    // Log the error and return a generic error message
    console.error("Error registering doctor:", err.message);
    return { status: 500, message: "Error registering doctor", error: err };
  }
};  




const doctorLogin = async (Doctor) => {
  const { email, password } = Doctor;
  const sql = `SELECT * FROM doctors WHERE email = ?`;

  try {
    console.log("SQL Query:", sql, "Email:", email);
    const [results] = await connection.query(sql, [email]);

    if (results.length === 0) {
      console.log("No user found for email:", email);
      return { status: 404, message: "User not found" };
    }

    const fetchedUser = results[0];
    console.log("Fetched User:", fetchedUser);

    // Ensure both password and fetchedUser.password are strings
    if (!fetchedUser.password) {
      return { status: 500, message: "Invalid password stored in database" };
    }

    const isPasswordValid = await bcrypt.compare(String(password), String(fetchedUser.password));
    console.log("Is Password Valid:", isPasswordValid);

    if (isPasswordValid) {
      return { status: 200, message: "Logged in successfully", user: fetchedUser };
    } else {
      return { status: 401, message: "Incorrect password" };
    }
  } catch (err) {
    console.error("Error in doctorLogin:", err);
    return { status: 500, message: "Error logging in", error: err.message || err };
  }
};



 

  const completeAppointment = async (id) => {
    try {
      // Update the appointment status to "COMPLETED"
      const updateSql = `UPDATE appointments SET status = "COMPLETED" WHERE appointment_id = ?;`;
      const selectSql = `SELECT slot_id FROM appointments WHERE appointment_id = ?;`;
  
      // Execute the update query
      const [updateResult] = await connection.execute(updateSql, [id]);
  
      // Get the associated slot_id
      const [rows] = await connection.execute(selectSql, [id]);
      const slotId = rows[0]?.slot_id; // Safely access the slot_id
  
      if (!slotId) {
        throw new Error("Slot ID not found for the given appointment ID.");
      }
  
      // Free the slot using the `appointment` module
      await appointment.freeSlot(slotId);
  
      return updateResult;
    } catch (error) {
      console.error("Error completing appointment:", error.message);
      throw error; // Re-throw the error to handle it at a higher level
    }
  };
  

module.exports = {toggledoctorStatus,getDoctorInfo,doctorRgeisteration,doctorLogin,completeAppointment,getallDoctors}