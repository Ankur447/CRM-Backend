const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox, // Use "Environment.Production" for live
  accessToken: "EAAAl-kdAdObAj0okDxpiYHDS3cR5ymcHE1uP4iU64vm3t1OuQqlvOJmgCtbA4J4", // Replace with your access token
});

const processPayment = async (req, res) => {
  const { nonce, amount } = req.body; // 'nonce' is generated on the client-side
  const idempotencyKey = require("crypto").randomUUID(); // Unique key for this transaction

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: nonce, // Comes from Square Payment Form (client-side)
      idempotencyKey,
      amountMoney: {
        amount: parseInt(amount * 100), // Amount in cents
        currency: "USD", // Change to your desired currency
      },
    });

    res.status(200).json({
      success: true,
      payment: response.result.payment,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { processPayment };
