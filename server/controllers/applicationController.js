import catchAsyncErrors from "../middleware/catchAsyncError.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return res
      .status(400)
      .json({ message: "Employer not allowed to access this resource." });
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Resume File Required!" });
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return res
      .status(400)
      .json({ message: "Invalid file type. Please upload a PNG file." });
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return res
      .status(500)
      .json({ message: "Failed to upload Resume to Cloudinary" });
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  const applicantId = {
    user: req.user._id,
    role: "Job Seeker",
  };

  if (!jobId) {
    return res.status(404).json({ message: "Job not found!" });
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return res.status(404).json({ message: "Job not found!" });
  }

  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantId ||
    !employerId ||
    !resume
  ) {
    return res.status(400).json({ message: "Please fill all fields." });
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantId,
    employerId,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

// ****************************************************************************************

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return res
        .status(400)
        .json({ message: "Job Seeker not allowed to access this resource." });
    }
    const { _id } = req.user;

    const applications = await Application.find({ "employerId.user": _id });

    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return res
        .status(400)
        .json({ message: "Employer not allowed to access this resource." });
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return res
        .status(400)
        .json({ message: "Employer not allowed to access this resource." });
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found!" });
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
