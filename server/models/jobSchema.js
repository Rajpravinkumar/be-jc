import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  fixedSalary: {
    type: Number,
    require: true,
  },
  salaryFrom: {
    type: Number,
    require: true,
  },
  salaryTo: {
    type: Number,
    require: true,
  },
  expire: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

export const Job = mongoose.model("JOB", jobSchema);
