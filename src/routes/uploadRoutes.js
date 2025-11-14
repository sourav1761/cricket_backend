import express from "express";
import upload from "../config/multer.js";
import { uploadPlayerDocuments } from "../controllers/uploadController.js";


const router = express.Router();

router.post(
  "/documents",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  uploadPlayerDocuments
);

export default router;
