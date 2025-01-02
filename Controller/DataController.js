const Data = require('../Models/User')


const Getdata=(req,res)=>{

    Data.data((err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }
    })
}
module.exports = {Getdata}