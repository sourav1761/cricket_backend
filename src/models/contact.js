import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    contactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
      default: "email",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    agreeToPrivacy: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
