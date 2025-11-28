// routes/payment.js
import express from "express";
import { createOrder, verifyPaymentAndRegister } from "../controllers/paymentController";


const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-and-register/:orderId", verifyPaymentAndRegister);

export default router;
