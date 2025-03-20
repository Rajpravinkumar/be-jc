import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  coverLetter: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  resume: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  applicantId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      require: true,
    },
  },
  employerId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      require: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
