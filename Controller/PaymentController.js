const Payment = require('../Models/Payment')
const CreateOrder = async (req, res) => {
 

  const paymentObj = req.body;
 
  
  try {
     
    result = await Payment.createOrder(paymentObj)
    console.log(result);
    
    return res.status(200).json({
     response: result,
     message:"order created"
     
    });
  } catch (err) {
    console.error("Error processing payment:", err);

    return res.status(500).json({
      message: "Error processing payment",
      error: err.message,
    });
  }
};

const GetAppointmentPrices = async(req,res)=>{
  try {
    const result = await Payment.getAppointmentPrices();

    return res.status(200).json({message:"Prices fetched sucessfully",result})
    
  } catch (error) {
    return res.status(500).json({error:error})
  }
}

module.exports = { CreateOrder,GetAppointmentPrices };
