import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    role: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    trialsCity: { type: String, required: true },
    profilePhoto: { type: String },
    aadharCard: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);
