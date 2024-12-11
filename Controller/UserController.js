
const User = require('../Models/User')
const registerUser = async (req, res) => {
    const user = req.body;
  
    try {
      const result = await User.register(user); // Await the promise returned by `register`
      return res.status(201).json(result); // Send success response
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: "Error registering user", error: err.message });
    }
  };
  
 const UpdateUser = async (req,res) =>{
    const user = req.body;
    
    

try{
    const result = await User.update(user)
    return res.status(201).json(result); 
     

} 
catch(err){
    console.error('Error registering user:', err);
      return res.status(500).json({ message: "Error updating user", error: err.message });

}}

const UpcomingAppointents = async (req,res)=>{

  const {id} = req.body;


  try{
      const result = await User.upcomingAppointments(id)
      return res.status(200).json(result); 
       
  
  } 
  catch(err){
      console.error('Error :fetching Upcoming appointments', err);
        return res.status(500).json({ message: "Error fetching Upcoming appointments", error: err.message });
}
}
 module.exports={registerUser,UpdateUser,UpcomingAppointents}