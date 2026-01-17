import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Candidate from "./models/Candidate.js";
import Election from "./models/Election.js";
import Voter from "./models/Voter.js";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();
await connectDB();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* =========================
   DEFAULT ADMIN CREATION
========================= */
const createAdmin = async () => {
  try {
    const adminEmail = "admin@evote.com";

    const exist = await User.findOne({ email: adminEmail });
    if (exist) return;

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created → admin@evote.com / admin123");
  } catch (err) {
    console.error("❌ Admin creation failed:", err.message);
  }
};
createAdmin();

/* =========================
   PUBLIC DATA ROUTES
========================= */
app.get("/api/elections", async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch {
    res.status(500).json({ message: "Failed to fetch elections" });
  }
});

app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch {
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

/* =========================
   VOTE STATUS
========================= */
app.get("/api/votes/status", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ voted: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const electionId = req.query.electionId;

    if (!electionId) return res.json({ voted: false });

    const voter = await Voter.findOne({
      userId: decoded.id,
      votedElection: electionId,
    });

    res.json({ voted: !!voter });
  } catch {
    res.json({ voted: false });
  }
});

/* =========================
   CAST VOTE
========================= */
app.post("/api/votes/vote", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { candidateId, electionId } = req.body;

    if (!candidateId || !electionId) {
      return res.status(400).json({ message: "Missing vote data" });
    }

    // Prevent double voting
    const alreadyVoted = await Voter.findOne({
      userId: decoded.id,
      votedElection: electionId,
    });

    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Save vote record
    await Voter.create({
      userId: decoded.id,
      votedElection: electionId,
    });

    // Increase candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { votes: 1 },
    });

    res.json({ message: "Vote successful" });
  } catch {
    res.status(500).json({ message: "Vote failed" });
  }
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

/* =========================
   ROOT + 404
========================= */
app.get("/", (req, res) => {
  res.send("🚀 E-Voting Backend Running");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
