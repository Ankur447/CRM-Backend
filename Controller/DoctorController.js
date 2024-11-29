const doctor = require('../Models/Doctors');

const ToggledoctorStatus = async (req,res) => {
    try {
        const {id } = req.params; // Extract doctor_id from the URL parameters

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
    const {id} = req.params;
    try {
        const result = await doctor.getDoctorInfo(id);
        return res.status(200).json({ message: "Success", data: result[0] });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
module.exports = { ToggledoctorStatus,GetDoctorInfo };
