import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =========================
   REGISTER (18+ REQUIRED)
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    // Basic validation
    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Age calculation (backend enforcement)
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res
        .status(403)
        .json({ message: "You must be at least 18 years old to register" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      role: user.role,
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   LOGIN (UNCHANGED LOGIC)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
