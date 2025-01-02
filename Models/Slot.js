const connection = require('../Config');
const pool = require('mysql2/promise'); // Ensure you use the correct database connection method
const cron = require('node-cron');

const getslotsbydoctorId = async (id) => {
 
  
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


const runInsertForAllSlots = async (date,id) => {
  try {
    const slots = await getslotsbydoctorId(id); // Fetch all slots
    if (slots.length === 0) {
      console.log("No slots found in the database.");
      return;
    }
    for (const slot of slots) {
      await insertSlotSchedule(slot.doctor_id, date); // Pass doctor_id and date to insertSlotSchedule
    }

    console.log("Slot schedule insertion completed for all slots.");
  } catch (err) {
    console.error("Error running insert for all slots:", err.message);
  }
};

//Example usage: Run the function for the current date
// ( () => {
//   const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
//    runInsertForAllSlots(currentDate,1);
//   console.log(currentDate);
  
// })();


const setSchedule = async (scheduleobj) => {
  const{doctor_id, excludedSlots, date} = await  scheduleobj;

  console.log("scheduleobj:", scheduleobj); // Ensure it's logged as expected

  // Destructure with fallback values
  //const { doctor_id = null, excludedSlots = [], date = null } = scheduleobj;

  console.log("doctor_id:", doctor_id);
  console.log("excludedSlots:", excludedSlots);
  console.log("date:", date);
  
  
  const insertSlotsQuery = `
    INSERT INTO slot_schedule (slot_id, doctor_id, date, status)
    SELECT slot_id, doctor_id, ?, 'AVAILABLE'
    FROM timeslots
    WHERE doctor_id = ?
      AND slot_id NOT IN (
        SELECT slot_id FROM slot_schedule WHERE doctor_id = ? AND date = ?
      )
  `;

  const excludeSlotsQuery = `
    UPDATE slot_schedule 
    SET status = 'EXCLUDED' 
    WHERE doctor_id = ? AND date = ? AND slot_id IN (?)
  `;

  const includeSlotsQuery = `
    UPDATE slot_schedule 
    SET status = 'AVAILABLE' 
    WHERE doctor_id = ? AND date = ? AND slot_id NOT IN (?)
  `;

  const allSlotsIncludedQuery = `
    UPDATE slot_schedule 
    SET status = 'AVAILABLE' 
    WHERE doctor_id = ? AND date = ?
  `;

  try {
    // Insert slots if they do not exist for the given date
    await connection.query(insertSlotsQuery, [ date,doctor_id, doctor_id,date]);

    if (excludedSlots && excludedSlots.length > 0) {
      // Exclude specified slots
      await connection.query(excludeSlotsQuery, [doctor_id, date, excludedSlots]);

      // Include other slots
      await connection.query(includeSlotsQuery, [doctor_id, date, excludedSlots]);
    } else {
      // If no slots are excluded, mark all as AVAILABLE
      await connection.query(allSlotsIncludedQuery, [doctor_id, date]);
    }

    return { message: "Slots successfully updated and inserted" };
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw new Error(`Failed to update schedule: ${error.message}`);
  }
};




// cron.schedule("* * * * * ",runInsertForAllSlots())


module.exports={getslotsbydoctorId,setSchedule}
