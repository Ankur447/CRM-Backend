const connection = require('../Config')
const express =  require('express')
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());



const appointments = async (patient) => {
  const { patient_id, name,  status, appointment_date, appointment_time} = patient;
  console.log(patient);

  try {
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

    // 2. Fetch an available slot schedule for the given date and time
    const [slotScheduleResult] = await connection.query(
      `SELECT ss.schedule_id, ts.slot_id, ss.current_bookings, ts.capacity 
       FROM slot_schedule ss
       JOIN timeslots ts ON ss.slot_id = ts.slot_id
       WHERE ss.doctor_id = ? 
         AND ss.date = ? 
         AND ts.start_time = ? 
         AND ss.status = "AVAILABLE" 
         AND ss.current_bookings < ts.capacity
       LIMIT 1 FOR UPDATE;`,
      [doctorId, appointment_date, appointment_time]
    );

    if (slotScheduleResult.length === 0) {
      throw new Error("No available slots for the selected doctor on the given date and time.");
    }

    const { schedule_id: slotScheduleId, current_bookings, capacity } = slotScheduleResult[0];

    // 3. Increment current bookings and update the slot schedule status if necessary
    const newBookings = current_bookings + 1;
    const newStatus = newBookings >= capacity ? "BOOKED" : "AVAILABLE";

    await connection.query(
      `UPDATE slot_schedule 
       SET current_bookings = ?, status = ? 
       WHERE schedule_id = ?;`,
      [newBookings, newStatus, slotScheduleId]
    );

    // 4. Create the appointment
    await connection.query(
      `INSERT INTO appointments (patient_id, doctor_id,appointment_date, appointment_time, status, slot_schedule_id) 
       VALUES (?, ?, ?,?, ?, ?);`,
      [patient_id, doctorId,appointment_date, appointment_time, status, slotScheduleId]
    );

    await connection.query('COMMIT'); // Commit the transaction
    console.log("Appointment successfully created!");
  } catch (err) {
    console.error("Error handling appointment:", err.message);
    if (connection) await connection.query('ROLLBACK'); // Rollback on error
    throw err;
  } finally {
    // Ensure the connection is closed or released
    // if (connection) connection.release();
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
     
      
        try {
         
          await connection.query('START TRANSACTION');
      
          // Check current bookings for the slot
          const [slot] = await connection.query(
            `SELECT current_bookings 
             FROM timeslots 
             WHERE slot_id = ?;`,
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
          // if (connection) connection.release();
        }
      };

      

const getappointments = async(id)=>{
  const sql = 'select * from daily_appointments  where doctor_id =?';
  
  const [result] = await connection.execute(sql,[id]);
  return result;
}





const getSlots = async (slotobj) => {  
 
  const {doctor_id,date} = slotobj;
  if (!slotobj.doctor_id) {
    throw new Error("Doctor ID is required to fetch slots.");
  }

  const sql =  `SELECT 
    ts.start_time, 
    ts.end_time, 
    ss.schedule_id, 
    ss.date, 
    ss.status
FROM 
    slot_schedule ss
JOIN 
    timeslots ts 
ON 
    ss.slot_id = ts.slot_id
WHERE 
    ss.doctor_id = ? AND ss.date = ?;
`;

  try {
    const [result] = await connection.execute(sql, [doctor_id,date]);

    if (result.length === 0) {
      console.warn(`No slots found for doctor ID: ${doctor_id}`);
    }

    return result;
  } catch (err) {
    console.error(`Error fetching slots for doctor ID ${doctor_id}:`, err.message);
    throw new Error("Failed to fetch slots from the database.");
  }
};




const appointmentsReminder = async (id) => {
  console.log(id);
  
  const sql = 'SELECT patient_id FROM patients WHERE user_id = ?';
  const sql2 = ` SELECT * 
  FROM daily_appointments 
  WHERE patient_id in (?)   AND appointment_time <= DATE_ADD(NOW(), INTERVAL 15 HOUR)
    AND appointment_time >NOW();`


 
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


 
      
  
      module.exports ={appointments,UpdateAppointmentStatus,cancelAppointment,freeSlot,getappointments,getSlots,appointmentsReminder}