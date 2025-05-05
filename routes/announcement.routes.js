const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { verifyToken, isAdmin } = require("../middleware/auth");

// ✅ Create (only if not already created)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const existing = await Announcement.findOne();
    if (existing) return res.status(400).json({ message: "Announcement already exists" });

    const { message } = req.body;
    const announcement = new Announcement({ message });
    await announcement.save();
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Edit the announcement
router.put("/edit", verifyToken, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    const announcement = await Announcement.findOne();
    if (!announcement) return res.status(404).json({ message: "No announcement found" });

    announcement.message = message;
    announcement.updatedAt = new Date();
    await announcement.save();

    res.json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Delete the announcement
router.delete("/delete", verifyToken, isAdmin, async (req, res) => {
  try {
    await Announcement.deleteMany(); // remove all
    res.json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get current announcement (public for users)
router.get("/", async (req, res) => {
  try {
    const announcement = await Announcement.findOne();
    if (!announcement) return res.json({ success: true, message: null });

    res.json({ success: true, message: announcement.message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
