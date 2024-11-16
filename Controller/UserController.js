
const User = require('../Models/User')

 const registerUser = (req,res) =>{
    const user = req.body;
       User.register(user,(err,result)=>{
        if (err) {
            return res.status(500).json({ message: "Error registering user", error: err });
        }
        res.status(201).json({ message: "User registered successfully" });
       })
 }
 const UpdateUser = (req,res) =>{
    const user = req.body;
       User.update(user,(err,result)=>{
        if (err) {
            return res.status(500).json({ message: "Error registering user", error: err });
        }
        res.status(201).json({ message: "User updated successfully" });
       })
 }
 module.exports={registerUser,UpdateUser}