import catchAsyncError from "../middleware/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";

// Get all jobs
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expire: false });

  res.status(200).json({
    success: true,
    jobs,
  });
});

// Create a new job
export const createJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return res.status(400).json({ message: "Error job seeker " });
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  // Validate required fields inside the async function
  if (!title || !description || !category || !country || !city || !location) {
    return res
      .status(400)
      .json({ message: "Error in JobController, please enter full details." });
  }

  // Ensure the user is authenticated
  const postedBy = req.user._id;

  // Create the new job
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully",
    job,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return res.status(400).json({ message: "Error job seeker " });
  }

  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return res.status(400).json({ message: "Error job seeker " });
  }
  const id = req.params.id;
  let job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({ message: "Error job not Found " });
  }

  await Job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job Deleted Successfully ",
    job,
  });
});

export const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: " Invalid Cast",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job show Successfully ",
      job,
    });
  } catch (e) {
    return res.status(400).json({
      message: " Invalid Cast",
    });
  }
});
