import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Date of Birth (Required for 18+ validation)
    dob: {
      type: Date,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

/* 🔒 AGE VALIDATION (18+) — BACKEND LEVEL */
userSchema.pre("save", function (next) {
  if (!this.dob) {
    return next(new Error("Date of birth is required"));
  }

  const today = new Date();
  const birthDate = new Date(this.dob);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return next(new Error("User must be at least 18 years old"));
  }

  next();
});

export default mongoose.model("User", userSchema);
