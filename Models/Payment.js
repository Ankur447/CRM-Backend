const express = require("express");
const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");
const { connect } = require("../Config"); // Assuming '../Config' exports the DB connection
require("dotenv").config(); // To load environment variables from .env file

const router = express.Router(); // Use router for modular endpoints

// Cashfree Credentials
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.NODE_ENV === "production" 
    ? Cashfree.Environment.PRODUCTION 
    : Cashfree.Environment.SANDBOX;

// Function to create an order
const createOrder = async (paymentObj) => {
  const { orderId, orderAmount, customerName, customerEmail, customerPhone } = paymentObj;

  const request = {
    order_amount: orderAmount.toString(),
    order_currency: "INR",
    customer_details: {
      customer_id: `node_sdk_test_${orderId}`,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    },
    order_meta: {
      return_url: `https://yourdomain.com/return-url?order_id=${orderId}`,
    },
    order_note: "Payment for Order",
  };

  try {
    const response = await Cashfree.PGCreateOrder("2025-01-01", request);
    return response.data;
  } catch (error) {
    console.error(
      "Error response data:",
      error.response ? error.response.data : "No response data"
    );
    throw new Error(error.response?.data?.message || "Order creation failed");
  }
};

// Function to get appointment prices
const getAppointmentPrices = async () => {
  const sql = `SELECT * FROM appointment_prices;`;
  try {
    const [result] = await connect.query(sql);
    return result;
  } catch (error) {
    console.error("Error fetching appointment prices:", error);
    return error;
  }
};

// Webhook route
router.post("/webhook/cashfree", (req, res) => {
  const CASHFREE_SECRET = process.env.CASHFREE_SECRET; // Environment variable for the secret key
  const signature = req.headers["x-webhook-signature"];
  const payload = JSON.stringify(req.body);

  // Validate the signature
  const hmac = crypto.createHmac("sha256", CASHFREE_SECRET).update(payload).digest("base64");
  if (signature !== hmac) {
    return res.status(400).send("Invalid signature");
  }

  // Process the webhook payload
  console.log("Webhook payload received:", req.body);

  res.status(200).send("Webhook received");
});

// Export the functions and router
module.exports = {
  createOrder,
  getAppointmentPrices,
  webhookRouter: router,
};
