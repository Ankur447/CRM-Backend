
const User = require('../Models/User')



const registerUser = async (req, res) => {
  const user = req.body;

  try {
    const result = await User.register(user); // Await the promise returned by `register`
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

const UpdateUser = async (req, res) => {
  const user = req.body;
  

  try {
    
    const result = await User.update(user)
    return res.status(201).json(result);
  }
  catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: "Error updating user", error: err.message });
  }
}


const UpcomingAppointents = async (req, res) => {

  const { id } = req.body;

  try {
    const result = await User.upcomingAppointments(id)
    return res.status(200).json(result);


  }
  catch (err) {
    console.error('Error :fetching Upcoming appointments', err);
    return res.status(500).json({ message: "Error fetching Upcoming appointments", error: err.message });
  }
}

const GetUserID = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await User.getUserId(email)
    return res.status(200).json(result);
  }
  catch (err) {
    console.error('Error :fetching userid', err);
    return res.status(500).json({ message: "Error fetching userID using userName", error: err.message });
  }

}


const GetAppointmentsByUserId = async (req, res) => {


  const { id } = req.body
  try {
    const result = await User.getappointmentsbyuserID(id);

    return res.status(200).json({
      message: "Appointments fetched successfully",
      data: result,
    });

  }
  catch (err) {
    console.error("Error fetching appointment:", err.message);
    return res.status(500).json({
      message: "Failed to fetch appointment",
      error: err.message,
    });
  }

}

const SendPasswordResetEmail =  async(req,res) =>{
  const {userEmail} = req.body;

  try {
    const result = await User.sendPasswordResetEmail(userEmail);

    return res.status(200).json({
      message: "Email sent sucessfully",
      data: result,
    });

  }
  catch (err) {
    console.error("Error sending email:", err.message);
    return res.status(500).json({
      message: "error sending email",
      error: err.message,
    });
  }
}
module.exports = {SendPasswordResetEmail, registerUser, UpdateUser, UpcomingAppointents, GetUserID, GetAppointmentsByUserId }