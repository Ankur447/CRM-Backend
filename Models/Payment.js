const express = require("express");
const { Cashfree } = require("cashfree-pg");
require("dotenv").config();  // To load environment variables from .env file

// To parse JSON request bodies

// Set the environment and credentials
Cashfree.XClientId = process.env.CashFreeAppId;
Cashfree.XClientSecret = process.env.CashFreeSecretKey;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;  // Change to PRODUCTION when ready

// POST endpoint to create an order
const createOrder=async (paymentObj) => {
  console.log(paymentObj);
  
  const { orderId, orderAmount, customerName, customerEmail, customerPhone } = paymentObj;

  const request = {
    "order_amount": orderAmount.toString(),  // Ensure it's a string
    "order_currency": "INR",  // Currency should be INR
    "customer_details": {
      "customer_id": `node_sdk_test_${orderId}`,  // Unique customer ID
      "customer_name": customerName,
      "customer_email": customerEmail,
      "customer_phone": customerPhone,
    },
    "order_meta": {
      "return_url": `https://yourdomain.com/return-url?order_id=${orderId}`,  // Change to your return URL
    },
    "order_note": "Payment for Order",  // Add a custom order note if needed
  };

  // Call Cashfree's PGCreateOrder method
  const response = await Cashfree.PGCreateOrder("2025-01-01", request)
 
    
    try {
      return response.data
      
    } catch (error) {
      console.error("Error setting up order request:", error.response ? error.response.data : error.message);
      return error;
    }
};



module.exports={createOrder}
