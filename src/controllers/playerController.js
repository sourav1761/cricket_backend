import { sendEmail } from "../config/email.js";
import Player from "../models/Player.js";

// Register a new player
// Generate Custom ACPL Player ID
function generatePlayerId() {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ACPL-${random}`;
}

export const registerPlayer = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      dob,
      role,
      state,
      city,
      trialsCity,
    } = req.body;

    // Check if already registered
    const existing = await Player.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Player already registered" });

    // Generate UNIQUE _id
    let playerId;
    while (true) {
      playerId = generatePlayerId();
      const exists = await Player.findById(playerId);
      if (!exists) break; // ensure 100% uniqueness
    }

    // Create player with custom _id
    const player = await Player.create({
      _id: playerId,
      fullName,
      mobile,
      email,
      dob,
      role,
      state,
      city,
      trialsCity,
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
              OFFICIAL ENTRY PASS
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

    res.status(201).json({
      message: "Player registered successfully",
      player,
    });

  } catch (error) {
    console.error("Error registering player:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// Get all players
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch players" });
  }
};

// Get player by ID
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: "Error fetching player" });
  }
};
