
const connection = require('../Config')
const toggledoctorStatus= async (id) => {
    const query = `
        UPDATE doctors
        SET status = CASE 
                        WHEN status = 'ACTIVE' THEN 'INACTIVE' 
                        ELSE 'ACTIVE' 
                     END
        WHERE doctor_id = ?
    `;

    const [result] = await connection.execute(query, [id]);

    // Check if any rows were updated
    return result.affectedRows > 0;
};

const getDoctorInfo  = async (id)=>{
    const sql = 'select name , status from doctors where doctor_id=?';

    const [result] = await connection.execute(sql,[id]);
    return result;
}
const doctorRgeisteration =async(doctor)=>{

    const {name,email,password}= doctor
    const sql = 'insert into doctors(name ,email,password) values(?,?,?)';

    const [result] = await connection.execute(sql,[name,email,password]);
    return result
}


const doctorLogin = async (doctor) => {
    const { email, password } = doctor;
    const sql = "SELECT * FROM doctors WHERE email = ?";
  
    try {
      const [results] = await connection.query(sql, [email]);
  
      if (results.length === 0) {
        return { status: 404, message: "User not found" };
      }
  
      const fetchedUser = results[0];
      console.log(fetchedUser.password , " ", password);
      
  
      if (fetchedUser.password === password) {
        return { status: 200, message: "Logged in successfully", doctor: fetchedUser };
      } else {
        return { status: 401, message: "Incorrect password" };
      }
    } catch (err) {
      return { status: 500, message: "Error logging in", error: err };
    }
  };

module.exports = {toggledoctorStatus,getDoctorInfo,doctorRgeisteration,doctorLogin}