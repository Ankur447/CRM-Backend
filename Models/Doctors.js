
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
module.exports = {toggledoctorStatus,getDoctorInfo}