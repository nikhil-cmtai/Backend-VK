const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_sD6C6D9RNmcc22", // Replace with your Razorpay Key ID
  key_secret: "dsEJ75ebV7wDyIIMKPzqbzXx", // Replace with your Razorpay Secret
});

// Function to create a Razorpay order
const createOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100, // Convert INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error("Error creating Razorpay order: " + error.message);
  }
};

// Function to verify payment signature
const verifyPayment = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const secret = "dsEJ75ebV7wDyIIMKPzqbzXx"; // Replace with your actual Razorpay secret key
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  return generated_signature === razorpay_signature;
};

module.exports = { createOrder, verifyPayment };
