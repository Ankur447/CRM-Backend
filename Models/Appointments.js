const connection = require('../Config')
const express =  require('express')
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());



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

      

const getappointments = async()=>{
  const sql = 'select * from appointments';

  const [result] = await connection.execute(sql);
  return result;
}
      
  
      module.exports ={appointments,UpdateAppointmentStatus,cancelAppointment,freeSlot,getappointments}