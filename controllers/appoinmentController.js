const {bookAppointment} = require('../models/appointment')

const bookAppointmentController = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date } = req.body;
    
    
    // Validate input
    if (!patient_id || !doctor_id || !appointment_date) {
      return res.status(400).json({
        message: 'Missing required fields: patient_id, doctor_id, appointment_date',
      });
    }

    // Call the model function to book the appointment
    const appointment = await bookAppointment(patient_id, doctor_id, appointment_date);
    

    return res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error in booking appointment:', error.message);

    return res.status(500).json({
      message: 'Failed to book appointment',
      error: error.message,
    });
  }
};

module.exports = {bookAppointmentController};
