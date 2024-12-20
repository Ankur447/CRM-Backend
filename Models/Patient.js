const connection = require('../Config');

const createPatientProfile = async (patient) => {
  const { first_name, last_name, email, phone, dob, gender, address, user_id } = patient;

  // Adjust the SQL query to match the table schema
  const sql = `INSERT INTO patients (first_name, last_name, email, phone, dob, gender, address, user_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const result = await connection.query(sql, [
      first_name,
      last_name,
      email,
      phone,
      dob,
      gender,
      address,
      user_id
    ]);

    return { message: "Patient created successfully", result };
  } catch (err) {
    return { status: 500, message: "Error registering patient", error: err };
  }
};




module.exports = { createPatientProfile };
