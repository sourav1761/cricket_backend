import express from "express";
import { submitContactForm, getContacts } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContactForm); // POST /api/contact
router.get("/", getContacts);       // GET /api/contact

export default router;
