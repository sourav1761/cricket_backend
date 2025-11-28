// controllers/payment.controller.js
import axios from "axios";
import Player from "../models/Player.js";
import { sendEmail } from "../config/email.js";
import { appId, secretKey, baseUrl } from "../config/cashfree.js";

// ----------------------
// Generate Custom ACPL Player ID
// ----------------------
function generatePlayerId() {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ACPL-${random}`;
}

// ----------------------
// Create Cashfree Order
// ----------------------
export const createOrder = async (req, res) => {
  try {
    const { orderId, orderAmount, customerName, customerPhone, customerEmail } = req.body;

    const response = await axios.post(`${baseUrl}/orders`,
      {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: customerPhone,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName,
        },
        order_meta: {
          return_url: `http://localhost:3000/registration?order_id=${orderId}`
        }
      },
      {
        headers: {
          "x-api-version": "2022-09-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error("Cashfree Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Order creation failed" });
  }
};

// ----------------------
// Verify Payment and Register Player
// ----------------------
export const verifyPaymentAndRegister = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId)

  try {
    // Fetch order status
    const response = await axios.get(`${baseUrl}/orders/${orderId}`, {
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
    });

    const order = response.data;

    if (order.order_status !== "PAID") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    const email = order.customer_details?.customer_email;

    if (!email)
      return res.status(400).json({ success: false, message: "Email missing" });

    // ----------------------
    // CHECK IF ALREADY REGISTERED
    // ----------------------
    const existing = await Player.findOne({ email });
    if (existing) {
      return res.json({
        success: true,
        message: "Player already registered",
        playerId: existing._id
      });
    }

    // ----------------------
    // CREATE NEW PLAYER
    // ----------------------
    let playerId;
    while (true) {
      playerId = generatePlayerId();
      const exists = await Player.findById(playerId);
      if (!exists) break;
    }

    // You will receive player details from frontend after payment
    const {
      fullName,
      mobile,
      dob,
      role,
      state,
      city,
      trialsCity,
      aadharNumber
    } = req.body;

    const player = await Player.create({
      _id: playerId,
      fullName,
      email,
      mobile,
      dob,
      role,
      state,
      city,
      trialsCity,
      aadharNumber,
      paymentVerified: true,
      paymentOrderId: orderId,
      paymentAmount: Number(order.order_amount),
      paymentDate: new Date()
    });

    // ----------------------
    // SEND GOLDEN TICKET EMAIL
    // ----------------------
    await sendEmail(
      email,
      "ACPL Cricket League Trials 2025 - Registration Confirmed",
      `<h2>Your ACPL Player ID</h2>
       <p><b>${playerId}</b></p>
       <p>You are officially registered for ACPL Cricket League Trials 2025.</p>`
    );

    return res.json({
      success: true,
      message: "Player registered successfully",
      playerId,
      player
    });

  } catch (err) {
    console.error("Verification Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Verification failed" });
  }
};
