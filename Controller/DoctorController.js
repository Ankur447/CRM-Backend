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

const DoctorRegistration= async (req,res)=>{

    const Doctor = req.body
    try{
        const result = await doctor.doctorRgeisteration(Doctor)
        return res.status(200).json({ message: "Success", data: result[0] });
          }
          catch (err) {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
   
}

const DoctorLogin = async (req,res)=>{
    
    const secretKey="nigga"
    const Doctor = req.body;

        try{
            const result  =  await doctor.doctorLogin(Doctor);
            let token ;
            console.log(result.status);
            
            // if(!token){
            //      token = jwt.sign({ id: result.user.id, email: result.user.email }, secretKey, {
            //         expiresIn: '1h',}) // Token expires in 1 hour
            // }

           if(result.status == 200){
            return res.status(200).json({message:"Logged in",token})
           }
           else{
            throw err
           }
           
          
        }
        catch(err){

            return res.status(500).json({message:"error logging in",err})
        }
    
}

const CompleteAppointment = async(req,res)=>{
    const {id} = req.params 
  try { 
    const result = await doctor.completeAppointment(id);
    return res.status(200).json({message:"appointment completed sucessfully"})
}
catch(err){
    console.log(err);
    
    return res.status(500).json({message:err})
}
    

}

const getAllDoctors = async(req,res)=>{
    try {
        const result = await doctor.getallDoctors();
        return res.status(200).json({ message: "Success", data: result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }


}
module.exports = { ToggledoctorStatus,GetDoctorInfo,DoctorRegistration,DoctorLogin,CompleteAppointment,getAllDoctors };
