const patient = require('../Models/Patient')

const createPatientProfile =async(req,res)=>{

    const PatientData= req.body;
   

    try{
        const result = patient.createPatientProfile(PatientData)
        return res.status(201).json(result); 
         
    
    } 
    catch(err){
        console.error('Error creating patient profile:', err);
          return res.status(500).json({ message: "Error creating patient profile", error: err.message });
    
    }
}

const GetPatientsByUserId = async(req,res)=>{
    const {id}= req.body;
   

    try{
        const result = await patient.getPatientsByUserId(id)
        
        
        return res.status(200).json(result); 
         } 
    catch(err){
        console.error('Error fetching patients:', err);
          return res.status(500).json({ message: "Error fetching patients", error: err.message });
    
    }
}
module.exports={createPatientProfile,GetPatientsByUserId}