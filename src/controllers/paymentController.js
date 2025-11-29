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

    try {
        // -----------------------------
        // 1️⃣ VERIFY PAYMENT IN CASHFREE
        // -----------------------------
        const response = await axios.get(`${baseUrl}/orders/${orderId}`, {
            headers: {
                "x-api-version": "2022-09-01",
                "x-client-id": appId,
                "x-client-secret": secretKey,
            },
        });

        const order = response.data;

        if (order.order_status !== "PAID") {
            return res.json({
                success: false,
                message: "Payment not completed",
            });
        }

        const email = order.customer_details?.customer_email;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email missing from payment record",
            });
        }

        // -----------------------------
        // 2️⃣ CHECK IF PLAYER ALREADY REGISTERED
        // -----------------------------
        const already = await Player.findOne({ email });

        if (already) {
            return res.json({
                success: true,
                alreadyRegistered: true,
                message: "Player already registered",
                playerId: already._id,
                player: already,
            });
        }

        // -----------------------------
        // 3️⃣ CREATE NEW PLAYER ENTRY
        // -----------------------------
        let playerId;

        while (true) {
            playerId = generatePlayerId();
            const exists = await Player.findById(playerId);
            if (!exists) break; // 100% unique ID
        }

        const {
            fullName,
            mobile,
            dob,
            role,
            state,
            city,
            trialsCity,
            aadharNumber
        } = req.body; // frontend sends raw player data

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
            paymentDate: new Date(),
        });

        // Send Golden Ticket Email
        await sendEmail(
            email,
            "ACPL Cricket League Trials 2025 - Official Registration Confirmation",
            `
  <div style="font-family: 'Arial', sans-serif; background-color: #f8f9fa; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">

      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a365d; font-size: 28px; margin-bottom: 10px; font-weight: 600;">
          ACPL CRICKET LEAGUE
        </h1>
        <p style="color: #4a5568; font-size: 16px; margin: 0;">
          Official Trials 2025 - Registration Confirmation
        </p>
      </div>

      <div style="border-left: 4px solid #d4af37; padding-left: 20px; margin-bottom: 30px;">
        <p style="color: #2d3748; font-size: 16px; line-height: 1.6; margin: 0;">
          Dear ${fullName},
        </p>
        <p style="color: #2d3748; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">
          Your registration for the ACPL Cricket League Trials 2025 has been successfully processed.
        </p>
      </div>

      <!-- OFFICIAL TICKET START -->
      <div style="
        margin: 30px auto;
        padding: 30px;
        border-radius: 12px;
        background: linear-gradient(135deg, #f7efd9 0%, #e8d99e 50%, #d4af37 100%);
        border: 1px solid #c5a22d;
        position: relative;
        overflow: hidden;
      ">

        <!-- Perforated edges effect -->
        <div style="
          position: absolute;
          top: 0;
          left: -5px;
          height: 100%;
          width: 10px;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 5px,
            #8b6f1e 5px,
            #8b6f1e 10px
          );
        "></div>
        <div style="
          position: absolute;
          top: 0;
          right: -5px;
          height: 100%;
          width: 10px;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 5px,
            #8b6f1e 5px,
            #8b6f1e 10px
          );
        "></div>

        <div style="text-align: center; position: relative; z-index: 1;">
          
          <div style="margin-bottom: 20px;">
            <h2 style="
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              color: #5d4200;
              letter-spacing: 2px;
              text-transform: uppercase;
            ">
              ACPL Ticket
            </h2>
            <p style="margin: 5px 0 0 0; color: #7a5c00; font-size: 14px;">
              ACPL Cricket League Trials 2025
            </p>
          </div>

          <div style="
            margin: 25px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #b8860b;
            border-radius: 8px;
            width: 80%;
            box-shadow: 0 4px 12px rgba(184, 134, 11, 0.2);
          ">
            <p style="
              margin: 0;
              font-size: 20px;
              font-weight: 700;
              color: #1a365d;
              letter-spacing: 1px;
              font-family: 'Courier New', monospace;
            ">
              ${playerId}
            </p>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            margin: 20px auto 0;
            padding-top: 15px;
            border-top: 1px dashed #b8860b;
            width: 90%;
          ">
            <span style="color: #5d4200; font-size: 12px; font-weight: 600;">
              VALID FOR TRIALS
            </span>
            <span style="color: #5d4200; font-size: 12px; font-weight: 600;">
              NON-TRANSFERABLE
            </span>
          </div>

        </div>
      </div>
      <!-- OFFICIAL TICKET END -->

      <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-top: 30px;">
        <h3 style="color: #2d3748; font-size: 16px; margin-bottom: 15px;">
          Important Information:
        </h3>
        <ul style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Please present this Player ID at the registration desk</li>
          <li>Venue details and reporting time will be communicated separately</li>
          <li>Carry valid government-issued photo identification</li>
          <li>Arrive 30 minutes prior to your scheduled time</li>
        </ul>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0;">
          For any inquiries regarding your registration, please contact the ACPL Management Team 
          by replying directly to this email.
        </p>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <p style="color: #4a5568; font-size: 14px; margin: 0;">
          Best Regards,<br>
          <strong style="color: #1a365d;">ACPL Cricket League Management</strong><br>
          Official Trials 2025
        </p>
      </div>

    </div>
  </div>
  `
        );

        // -----------------------------
        // 5️⃣ RESPONSE
        // -----------------------------
        return res.json({
            success: true,
            message: "Player registered successfully",
            playerId,
            player,
        });

    } catch (error) {
        console.error("Verification Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Verification failed",
            error: error.message,
        });
    }
};
