const connection = require('../Config');
const pool = require('mysql2/promise'); // Ensure you use the correct database connection method
const cron = require('node-cron');
/**
 * Fetch all timeslots from the timeslots table.
 * @returns {Promise<Array>} - List of all timeslots.
 */
const getslotsbydoctorId = async (id) => {
  console.log(id);
  
  const sql = `SELECT * FROM timeslots where doctor_id=?`;
  try {
    const [result] = await connection.query(sql,[id]);
    
     // Use connection.promise() for async/await
    return result;
  } catch (err) {
    console.error("Error fetching timeslots:", err.message);
    throw err;
  }
};


/**
 * Insert slot schedule for a specific doctor and date.
 * @param {number} doctorId - Doctor ID.
 * @param {string} date - Slot date in 'YYYY-MM-DD' format.
 * @returns {Promise<void>}
 */
const insertSlotSchedule = async (doctorId, date) => {
  if (!doctorId || !date) {
    throw new Error("Doctor ID and date are required.");
  }

  const sql = `
    INSERT INTO slot_schedule (slot_id, doctor_id, date, status, current_bookings)
    SELECT slot_id, doctor_id, ?, 'AVAILABLE', 0
    FROM timeslots
    WHERE doctor_id = ?
  `;

  try {
    const [result] = await connection.query(sql,[ doctorId,date]);
    console.log(
      `Inserted ${result.affectedRows} rows into slot_schedule for doctor_id: ${doctorId} on date: ${date}.`
    );
  } catch (error) {
    console.error("Error inserting slot schedule:", error.message);
    throw error;
  }
};

/**
 * Run insertSlotSchedule for all slots fetched from getallslots.
 * @param {string} date - Date for which to insert slot schedules.
 * @returns {Promise<void>}
 */
// const runInsertForAllSlots = async (date) => {
//   try {
//     const slots = await getslotsbydoctorId(); // Fetch all slots
//     if (slots.length === 0) {
//       console.log("No slots found in the database.");
//       return;
//     }

//     for (const slot of slots) {
//       await insertSlotSchedule(slot.doctor_id, date); // Pass doctor_id and date to insertSlotSchedule
//     }

//     console.log("Slot schedule insertion completed for all slots.");
//   } catch (err) {
//     console.error("Error running insert for all slots:", err.message);
//   }
// };

// Example usage: Run the function for the current date
// ( () => {
//   const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
//    runInsertForAllSlots(currentDate);
//   console.log(currentDate);
  
// })();

// cron.schedule("* * * * * ",runInsertForAllSlots())


module.exports={getslotsbydoctorId}
