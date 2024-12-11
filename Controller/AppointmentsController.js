const Appointment =require("../Models/Appointments")
 // Adjust the path to your Appointment model

const GetAppointments = async (req, res) => {
  const patient = req.body;

  try {
    // Call the `appointments` function and wait for the result
    const result = await Appointment.appointments(patient);
    res.status(200).json({
      message: "Appointment created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    res.status(500).json({
      message: "Failed to create appointment",
      error: err.message,
    });
  }
};

 const GetallAppointments= async (req,res)=>{
    
 
    
      try{  const result = await Appointment.getappointments();
        res.status(200).json({
          message: "Appointments fetched successfully",
          data: result,
        });}
       catch (err) {
        console.error("Error fetching appointment:", err.message);
        res.status(500).json({
          message: "Failed to fetch appointment",
          error: err.message,
        });
      }
    
  }

  const GetallSlots= async (req,res)=>{
    
 
    const  doctor_id  = req.params;
    
    
    try{  const result = await Appointment.getSlots(doctor_id);
      return res.status(200).json({
        message: "slots fetched successfully",
        data: result,
      });}
     catch (err) {
      console.error("Error fetching slots:", err.message);
       return res.status(500).json({
        message: "Failed to fetch slots",
        error: err.message,
      });
    }
  
}

module.exports = {GetAppointments,GetallAppointments,GetallSlots}