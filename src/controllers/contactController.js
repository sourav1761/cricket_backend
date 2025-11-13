import Contact from "../models/contact.js";

// Create new contact message
export const submitContactForm = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ success: true, message: "Message submitted successfully", data: newContact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all contact messages (for admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
