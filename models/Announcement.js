const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
