const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox, // Use "Environment.Production" for live
  accessToken: "EAAAl-EAAAl-kdAdObAj0okDxpiYHDS3cR5ymcHE1uP4iU64vm3t1OuQqlvOJmgCtbA4J4", // Replace with your access token
});

/**
 * Process a payment using the Square API.
 */
const ProcessPayment = async (req, res) => {
  const { nonce, amount } = req.body;

  const idempotencyKey = require("crypto").randomUUID(); // Unique key for this transaction

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: nonce, // Comes from Square Payment Form (client-side)
      idempotencyKey,
      amountMoney: {
        amount: parseInt(amount * 100), // Amount in cents
        currency: "USD", // Adjust currency as needed
      },
    });

    console.log("Payment processed successfully:", response.result.payment);

    return res.status(200).json({
      success: true,
      payment: response.result.payment,
    });
  } catch (err) {
    console.error("Error processing payment:", err);

    return res.status(500).json({
      message: "Error processing payment",
      error: err.message,
    });
  }
};

module.exports = { ProcessPayment };
