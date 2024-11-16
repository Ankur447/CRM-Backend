const pool = require("../config/db");

const appointments = async (patient) => {
    const { patient_id, name, appointment_time, status } = patient;
    console.log(patient);
    console.log("Niggga moww!!!");
  
    const client = await pool.connect(); // Explicitly get a client for transaction
  
    try {
      await client.query('BEGIN'); // Begin the transaction
  
      // 1. Fetch the doctor ID
      const doctorResult = await client.query(
        `SELECT doctor_id 
         FROM doctors 
         WHERE name = $1 AND status = 'ACTIVE'`, 
        [name]
      );
  
      if (doctorResult.rows.length === 0) {
        throw new Error("No active doctor found with the given name.");
      }
      const doctorId = doctorResult.rows[0].doctor_id;
  
      // 2. Fetch an available slot
      const slotResult = await client.query(
        `SELECT slot_id, current_bookings, capacity 
         FROM slots 
         WHERE doctor_id = $1 AND status = 'AVAILABLE' AND current_bookings < capacity 
         LIMIT 1 FOR UPDATE`,
        [doctorId]
      );
  
      if (slotResult.rows.length === 0) {
        throw new Error("No available slots for the selected doctor.");
      }
  
      const { slot_id: slotId, current_bookings, capacity } = slotResult.rows[0];
  
      // 3. Increment current bookings and update the slot status if necessary
      const newBookings = current_bookings + 1;
      const newStatus = newBookings >= capacity ? 'BOOKED' : 'AVAILABLE';
  
      await client.query(
        `UPDATE slots 
         SET current_bookings = $1, status = $2 
         WHERE slot_id = $3`,
        [newBookings, newStatus, slotId]
      );
  
      // 4. Create the appointment
      await client.query(
        `INSERT INTO appointments (patient_id, slot_id, appointment_time, status) 
         VALUES ($1, $2, $3, $4)`,
        [patient_id, slotId, appointment_time, status]
      );
  
      await client.query('COMMIT'); // Commit the transaction
      console.log("Appointment successfully created!");
    } catch (err) {
      console.error("Error handling appointment:", err.message);
      await client.query('ROLLBACK'); // Rollback on error
      throw err;
    } finally {
      client.release(); // Release the client
    }
  };
  module.exports = { appointments }; // Exporting the function
