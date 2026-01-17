import mongoose from "mongoose";

const voterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votedElection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    votedCandidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
  },
  { timestamps: true }
);

/* =========================
   PREVENT DOUBLE VOTING
========================= */
voterSchema.index(
  { userId: 1, votedElection: 1 },
  { unique: true }
);

export default mongoose.model("Voter", voterSchema);
