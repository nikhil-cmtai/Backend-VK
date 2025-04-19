const express = require("express");
const { createOrder, verifyPayment } = require("../config/cashfree");

const router = express.Router();

// Route to create a Cashfree payment order
router.post("/create-order", async (req, res) => {
  try {

    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a payment order
    const paymentOrder = await createOrder(amount, {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    });

    res.status(200).json({
      success: true,
      payment_session_id: paymentOrder.payment_session_id,
      orderId: paymentOrder.order_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to verify payment signature
router.post("/verify-payment", (req, res) => {
  try {
    const { orderId, orderAmount, referenceId, paymentSignature } = req.body;

    // Validate request body
    if (!orderId || !orderAmount || !referenceId || !paymentSignature) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify the payment signature
    const isValid = verifyPayment(orderId, orderAmount, referenceId, paymentSignature);

    if (isValid) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;