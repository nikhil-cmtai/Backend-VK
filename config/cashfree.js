const axios = require("axios");
const crypto = require("crypto");
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID_TEST;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY_TEST;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL_TEST;

// Function to create a Cashfree order
const createOrder = async (amount, customerDetails) => {
  try {
    const orderId = `order_${Date.now()}`;
    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        ...customerDetails,
        customer_id: `customer_${Date.now()}`, // Add customer_id
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01", // Version header
    };

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error creating Cashfree order: " + error.message);
  }
};

// Function to verify payment signature
const verifyPayment = (orderId, orderAmount, referenceId, paymentSignature) => {
  const payload = `${orderId}${orderAmount}${referenceId}`;
  const generatedSignature = crypto
    .createHmac("sha256", CASHFREE_SECRET_KEY)
    .update(payload)
    .digest("base64");

  return generatedSignature === paymentSignature;
};

module.exports = { createOrder, verifyPayment };
