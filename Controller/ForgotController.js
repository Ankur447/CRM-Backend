const ForgotController = require('../Models/User')

const ForgotUser = async (req,res)=>{
 const user = req.body
   
    try{
        const result = await ForgotController.forgot(user)

    }
    catch(err){

    }
}