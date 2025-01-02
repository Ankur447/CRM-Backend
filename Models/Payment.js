const express = require("express");
const { Cashfree } = require("cashfree-pg");
require("dotenv").config(); // To load environment variables from .env file
const { connect } = require("../Config");
require("dotenv").config();  // To load environment variables from .env file
const connection = require('../Config')

// To parse JSON request bodies

// Set the environment and credentials
Cashfree.XClientId = process.env.CashFreeAppId;
Cashfree.XClientSecret = process.env.CashFreeSecretKey;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Change to PRODUCTION when ready\

// POST endpoint to create an order
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


module.exports = { createOrder };
  getAppointmentPrices =async()=>{
    const sql = `select * from appointment_prices;`
    try {
      const [result] = await connection.query(sql)
      return result;

    } catch (error) {
        console.log(error)
        return error;
    }
  }


module.exports={createOrder,getAppointmentPrices}
