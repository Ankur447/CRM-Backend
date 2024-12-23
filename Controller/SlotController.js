const slot = require('..//Models/Slot')


const GetslotsbydoctorID = async(req,res)=>{

    const {doctor_id} = req.body;
    try{
        const result = await slot.getslotsbydoctorId(doctor_id);
       
        
        return res.status(200).json({ data: result });
    }

catch(err){
    console.error('Error :fetching slots', err);
    return res.status(500).json({ message: "Error fetching slots using doctorId", error: err.message });
}
}




const SetSchedule = async (req, res) => {
  const scheduleobj = req.body;



  
  try {
    // Call model function to update the schedule
    const result = await slot.setSchedule(scheduleobj);
    return res.status(200).json(result); // Return success response
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    return res.status(500).send({
      message: "Error updating schedule",
      error: error.message,
    });
  }
};

module.exports = { SetSchedule };

module.exports={GetslotsbydoctorID,SetSchedule}