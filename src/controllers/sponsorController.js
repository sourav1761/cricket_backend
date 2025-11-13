import Sponsor from "../models/sponsor.js";

// Register new sponsor
export const registerSponsor = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      website,
      sponsorshipTier,
      budget,
      amount,
      message,
      agreeToContact
    } = req.body;

    const sponsor = await Sponsor.create({
      companyName,
      contactPerson,
      email,
      phone,
      website,
      sponsorshipTier,
      budget,
      amount,
      message,
      agreeToContact
    });

    res.status(201).json({ message: "Sponsor inquiry submitted successfully", sponsor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all sponsors
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sponsors" });
  }
};

// Get single sponsor by ID
export const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.json(sponsor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sponsor" });
  }
};
