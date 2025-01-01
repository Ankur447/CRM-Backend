const Payment = require('../Models/Payment')
const CreateOrder = async (req, res) => {
 

  const paymentObj = req.body;
 
  
  try {
     
    result = await Payment.createOrder(paymentObj)

    return res.status(200).json({
      success: result,
     
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
