const pool = require("../config/db");

const bookAppointment = async (patientId, doctorId, appointmentDate) => {
  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN'); // Start transaction
      // 1. Get the next available token for the doctor on the given date
      const tokenQuery = `
        SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token
        FROM appointments
        WHERE doctor_id = $1 AND appointment_date = $2 ;
      `;
      const { rows: tokenRows } = await client.query(tokenQuery, [doctorId, appointmentDate]);
      const nextToken = tokenRows[0].next_token;

      // 2. Insert the appointment
      const insertQuery = `
        INSERT INTO appointments (patient_id, doctor_id, token_number, appointment_date, status)
        VALUES ($1, $2, $3, $4, 'PENDING')
        RETURNING *;
      `;
      const { rows: appointmentRows } = await client.query(insertQuery, [
        patientId,
        doctorId,
        nextToken,
        appointmentDate,
      ]);

      await client.query('COMMIT'); // Commit transaction
      return appointmentRows[0];
    } catch (err) {
      await client.query('ROLLBACK'); // Rollback transaction in case of error
      throw err;
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (err) {
    console.error('Error booking appointment:', err.message);
    throw new Error('Failed to book appointment.');
  }
};

module.exports = {bookAppointment};