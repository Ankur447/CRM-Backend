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

module.exports = { CreateOrder };
