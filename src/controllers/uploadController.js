import cloudinary from "../config/cloudinary.js";
import Player from "../models/Player.js";

export const uploadPlayerDocuments = async (req, res) => {
  try {
    console.log("📨 Upload request received");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Cloudinary upload helper
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "acpl_players", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        ).end(fileBuffer);
      });
    };

    let profilePhotoUrl = null;
    let aadharCardUrl = null;

    // Upload profile photo if exists
    if (req.files?.profilePhoto) {
      const fileBuffer = req.files.profilePhoto[0].buffer;
      console.log("Uploading profile photo...");
      profilePhotoUrl = await uploadToCloudinary(fileBuffer);
    }

    // Upload aadhar card if exists
    if (req.files?.aadharCard) {
      const fileBuffer = req.files.aadharCard[0].buffer;
      console.log("Uploading aadhar card...");
      aadharCardUrl = await uploadToCloudinary(fileBuffer);
    }

    console.log("📸 Profile photo URL:", profilePhotoUrl);
    console.log("📄 Aadhar card URL:", aadharCardUrl);

    const updatedPlayer = await Player.findByIdAndUpdate(
      userId,
      {
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        ...(aadharCardUrl && { aadharCard: aadharCardUrl }),
        documentsUploaded: !!(profilePhotoUrl || aadharCardUrl),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      player: updatedPlayer,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
};
