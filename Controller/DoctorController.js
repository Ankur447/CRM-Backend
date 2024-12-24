const doctor = require('../Models/Doctors');
const jwt = require('jsonwebtoken');

const ToggledoctorStatus = async (req, res) => {
    try {
        const { id } = req.params; // Extract doctor_id from the URL parameters

        if (!id) {
            return res.status(400).json({ message: "doctor_id is required" });
        }

        const result = await doctor.toggledoctorStatus(id); // Call the model method

        if (result) {
            return res.status(200).json({ message: "Success", result });
        } else {
            return res.status(404).json({ message: "Doctor not found" });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const GetDoctorInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await doctor.getDoctorInfo(id);

       
        

        return res.status(200).json({ message: "Success", data: result[0], token });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const DoctorRegistration = async (req, res) => {
    const doctorData = req.body;

    try {
        // Call the service method to register the doctor
        const result = await doctor.doctorRgeisteration(doctorData);

        // Check for errors in the result from the service
        if (result.status && result.status === 500) {
            return res.status(500).json({
                message: "Error registering doctor",
                error: result.error
            });
        }

        // Success response
        return res.status(201).json({
            message: "Doctor registered successfully",
            data: result
        });
    } catch (err) {
        // Catch unexpected errors
        console.error("Error in DoctorRegistration controller:", err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};


const DoctorLogin = async (req, res) => {
    const secretKey = "nigga"; // Replace with a secure secret key
    const Doctor = req.body;


    const result = await doctor.doctorLogin(Doctor);

    let token;
    if (!token) {
        token = jwt.sign({ id: result.user.id, email: result.user.email, role: "user" }, secretKey, {
            expiresIn: '1h',
        }) // Token expires in 1 hour
    }
   

    if (result.status === 200 ) {
   
        const token = jwt.sign(
            { id: result.user.id, email: result.user.email ,role :"doctor" },
            secretKey,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.status(200).json({
            message: "Logged in",
            user: result.user ,
            token: token
            // Send the token as part of the response
        });
    } else {
        // Handle specific error cases (e.g., 404 or 401)
        return res.status(result.status).json({ message: result.message });
    }

    // Log the error for debugging purposes
    console.error("Error logging in:", err);

    return res.status(500).json({
        message: "Error logging in",
        error: err.message || err
    });

};


const CompleteAppointment = async (req, res) => {
    const { id } = req.params
    try {
        const result = await doctor.completeAppointment(id);
        return res.status(200).json({ message: "appointment completed sucessfully" })
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({ message: err })
    }


}

const getAllDoctors = async (req, res) => {
    try {
        const result = await doctor.getallDoctors();
        return res.status(200).json({ message: "Success", data: result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }


}
module.exports = { ToggledoctorStatus, GetDoctorInfo, DoctorRegistration, DoctorLogin, CompleteAppointment, getAllDoctors };
