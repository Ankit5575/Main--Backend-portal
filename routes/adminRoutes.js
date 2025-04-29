const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Admin");
const { generateToken, verifyToken, isAdmin } = require("../middleware/auth")
const router = express.Router();
require("dotenv").config();

// ✅ Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin, // if true, the user will be an admin
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.isAdmin);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.isAdmin);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Admin Protected Route
router.get("/admin-data", verifyToken, isAdmin, async (req, res) => {
  try {
    // Only accessible by admins
    res.status(200).json({
      success: true,
      message: "Admin data accessed successfully",
      adminInfo: req.user,
    });
  } catch (err) {
    console.error("Error in accessing admin data:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
