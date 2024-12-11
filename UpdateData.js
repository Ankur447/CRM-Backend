const cron = require('node-cron');
const connection = require('./Config'); // Import your database connection

// Function to update daily_appointments
const updateDailyAppointments = async () => {
  try {
    console.log('Running daily_appointments update...');

    // Step 1: Delete old data for the current day
    await connection.query(`
      DELETE FROM daily_appointments 
      WHERE DATE(appointment_time) = CURDATE();
    `);

    // Step 2: Insert current day's appointments
    await connection.query(`
      INSERT INTO daily_appointments (
          appointment_id, 
          patient_id, 
          slot_id, 
          doctor_id, 
          token_number, 
          appointment_time, 
          status, 
          created_at, 
          updated_at
      )
      SELECT
          a.appointment_id,
          a.patient_id,
          a.slot_id,
          a.doctor_id,
          NULL AS token_number,
          CONCAT(a.appointment_date, ' ', a.appointment_time) AS appointment_time,
          a.status,
          a.created_at,
          a.updated_at
      FROM appointments a
      WHERE a.appointment_date = CURDATE();
    `);

    console.log('Daily appointments updated successfully.');
  } catch (error) {
    console.error('Error updating daily appointments:', error.message);
  }
};

// Schedule the task to run every minute
cron.schedule('* * * * *', updateDailyAppointments);
