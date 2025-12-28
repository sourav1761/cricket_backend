import Razorpay from "razorpay";
import crypto from "crypto";
import dayjs from "dayjs";
import { razorpayKeyId, razorpayKeySecret } from "../config/razorpay.js";

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt = `order_rcptid_${Date.now()}` } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in paisa
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
    console.log(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

export const verifyOrder = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, phone, amount } = req.body;
  console.log('🧾 Verify Cricket Payment Request:', req.body);

  // Step 1: Verify signature
  const generated_signature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  // Step 2: Validate amount
  if (amount !== 749) {
    return res.status(400).json({ success: false, message: 'Invalid amount. Expected ₹749 for cricket registration.' });
  }

  // Step 3: Return successful registration response
  try {
    const now = dayjs();

    return res.json({
      success: true,
      message: 'Cricket registration payment verified successfully',
      registration: {
        name,
        email,
        phone,
        amount: 749,
        payment_status: 'verified',
        razorpay_order_id,
        razorpay_payment_id,
        verified_at: now.toDate(),
      },
    });
  } catch (err) {
    console.error('❌ Razorpay Verification Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to verify cricket registration payment' });
  }
};