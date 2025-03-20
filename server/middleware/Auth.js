import catchAsyncError from "../middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const isAuthorized =
  catchAsyncError(
  async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }
    const decoeded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoeded.id);

    next();
  });
