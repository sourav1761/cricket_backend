import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    sponsorshipTier: { type: String, required: true },
    budget: { type: String },
    amount: { type: String },
    message: { type: String },
    agreeToContact: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Sponsor", sponsorSchema);
