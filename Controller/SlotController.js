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

module.exports={GetslotsbydoctorID}