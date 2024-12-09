const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const Login = async(req, res) => {
    const secretKey="nigga"
    const user = req.body;

        try{
            const result  =  await User.login(user);
            let token ;
            if(!token){
                 token = jwt.sign({ id: result.user.id, email: result.user.email }, secretKey, {
                    expiresIn: '1h',}) // Token expires in 1 hour
            }

            
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
};

module.exports = { Login };
