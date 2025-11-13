import Player from "../models/Player.js";

// Register a new player
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

    const existing = await Player.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Player already registered" });

    // Handle file uploads
    const profilePhoto = req.files?.profilePhoto
      ? req.files.profilePhoto[0].path
      : null;
    const aadharCard = req.files?.aadharCard
      ? req.files.aadharCard[0].path
      : null;

    const player = await Player.create({
      fullName,
      mobile,
      email,
      dob,
      role,
      state,
      city,
      trialsCity,
      profilePhoto,
      aadharCard,
    });

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
