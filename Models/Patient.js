const connection = require('../Config');
const { completeAppointment } = require('./Doctors');

const createPatientProfile = async (patient) => {
  const { first_name, last_name, email, phone, dob, gender, address, user_id,age} = patient;

  // Adjust the SQL query to match the table schema
  const sql = `INSERT INTO patients (first_name, last_name, email, phone, dob, gender, address, user_id,age) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

  try {
    const result = await connection.query(sql, [
      first_name,
      last_name,
      email,
      phone,
      dob,
      gender,
      address,
      user_id,
      age
    ]);

    return { message: "Patient created successfully", result };
  } catch (err) {
    return { status: 500, message: "Error registering patient", error: err };
  }
};


const getPatientsByUserId = async(id)=>{
  
  
    const sql =`select * from patients where user_id =?`
  try{
    const [result] = await connection.query(sql,[id]);


    return {message :"Patients fetched sucessfully", result}

  }
  catch(err){
    return {status:500,message :"error fetching patients",err}
  } 

}


const getPatientDetails = async (patient_id) =>{
    const sql =`select * from patients where patient_id in (?)`
    try{
      const [patientResult] = await connection.query(sql,[patient_id]);
      
      console.log(patientResult);
      return patientResult
    }
    catch(err){
      return err;
    }
}





module.exports = { createPatientProfile ,getPatientsByUserId,getPatientDetails};
