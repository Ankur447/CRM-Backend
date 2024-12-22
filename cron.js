const cron = require('node-cron');
const connection = require('./Config'); // Import your database connection
const cors = require('cors')
const AppointmentController = require ('./Controller/AppointmentsController')
// Function to update daily_appointments


const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const updateDailyAppointments = async () => {
  try {
    console.log("Running daily_appointments update...");

    // Step 1: Delete old data for the current day
    await connection.query(`
      DELETE FROM daily_appointments 
      WHERE DATE(appointment_time) = CURDATE();
    `);

    // Optional: Truncate the table (use cautiously)
    // Uncomment only if necessary
    // await connection.query("TRUNCATE TABLE daily_appointments;");

    // Step 2: Insert current day's appointments into `daily_appointments`
    const result = await connection.query(`
      INSERT INTO daily_appointments (
          appointment_id, 
          patient_id, 
          slot_schedule_id, 
          doctor_id, 
          appointment_date,
          appointment_time, 
          status, 
          created_at, 
          updated_at
      )
      SELECT 
          a.appointment_id,
          a.patient_id,
          a.slot_schedule_id, -- Using slot_schedule_id directly as slot_id
          a.doctor_id,
          a.appointment_date,
          CONCAT(a.appointment_date, ' ', a.appointment_time) AS appointment_time, -- Concatenating appointment_date and appointment_time
          a.status,
          a.created_at,
          a.updated_at
      FROM appointments a
      WHERE a.appointment_date = CURDATE()
      ORDER BY a.appointment_time;
    `);

    console.log(
      `Daily appointments updated successfully at ${new Date().toISOString()}. Rows affected: ${result[0].affectedRows}`
    );
  } catch (error) {
    console.error("Error updating daily appointments:", error.message);
  }
};



    

// Schedule the task to run every minute
cron.schedule('* * * * *', updateDailyAppointments);
cron.schedule('* * * * *', AppointmentController.AppointmentsReminder);

