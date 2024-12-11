const express = require('express');
const cors = require('cors')
const connection = require('./Config');
const middleware = require('./Middleware/authMiddleware')
const cron = require('node-cron');
const port = 3000;

const route = require('./Routes/Routes')
const app = express();
app.use(cors());
app.use(express.json());
// app.use(middleware)

app.listen(port,()=>{
    console.log(`server started on ${port}`)
})

app.use('/api/',route);


module.exports=app







const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

// Get time components
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
console.log(minutes,seconds);

  

const updateDailyAppointments = async () => {
    try {
      console.log('Running daily_appointments update...');
  
      // Step 1: Delete old data for the current day
      await connection.query(`
        DELETE FROM daily_appointments 
        WHERE DATE(appointment_time) = CURDATE();
      `);
      await connection.query(`
        truncate daily_appointments ;
        
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
        WHERE a.appointment_date = CURDATE()
        order by appointment_time;
      `);
  
      console.log('Daily appointments updated successfully at.',currentDateTime);
    } catch (error) {
      console.error('Error updating daily appointments:', error.message);
    }
  };
  
  // Schedule the task to run every minute
  cron.schedule('* * * * *', updateDailyAppointments);
