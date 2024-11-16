const Appointment = require("../models/appoinment")

const createAppoinment = async (req, res) => {
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

module.exports = { createAppoinment };  
