import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  registerPlayer,
  getPlayers,
  getPlayerById,
} from "../controllers/playerController.js";

const router = express.Router();

// Ensure upload folder exists
const uploadPath = "uploads/players";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getPlayers);
router.get("/:id", getPlayerById);
router.post(
  "/",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  registerPlayer
);

export default router;
