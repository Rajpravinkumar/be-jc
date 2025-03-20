import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ["Employer", "Job Seeker"], // Make sure these values are allowed
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Hash Password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});

//  Comparing Password

userSchema.methods.comparePassword = async function (passcode) {
  return await bcrypt.compare(passcode, this.password);
};

// Generate JWT

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
