import express from "express";
import {
  registerSponsor,
  getSponsors,
  getSponsorById
} from "../controllers/sponsorController.js";

const router = express.Router();

router.get("/", getSponsors);
router.get("/:id", getSponsorById);
router.post("/", registerSponsor);

export default router;
