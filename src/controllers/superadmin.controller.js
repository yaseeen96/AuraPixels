import asyncHandler from "express-async-handler";
import { User } from "../models/User/user.model.js";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { sendAccountCreationEmailService } from "../utils/sendMail.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { status } = req.query;

    // Define the valid statuses
    const validStatuses = ["approved", "pending", "rejected"];

    // Check if the provided status is valid
    if (status && !validStatuses.includes(status)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: `Invalid status filter: ${status}. Valid filters are: ${validStatuses.join(", ")}`,
      });
    }

    // Initialize the filter object
    const filters = {};

    // Apply status filter if provided and valid
    if (status) {
      filters.status = status;
    }

    // Fetch users with the applied status filter
    const users = await User.find(filters);

    // Send response with filtered users (empty list if no users found)
    res.status(httpStatus.OK).json({ users: users });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, userId } = req.body;

  if (!password || !userId) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "Please provide a password & user id" });
    return;
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Something went wrong. can't reset password" });
    return;
  }

  try {
    user.password = password;
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    res.status(httpStatus.OK).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Cannot update password" });
    return;
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "Please provide a user id" });
    return;
  }
  const user = await User.findById(userId);
  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Something went wrong. can't logout" });
    return;
  }
  try {
    await user.updateOne({ $unset: { refreshToken: 1 } });

    res.status(httpStatus.OK).json({
      message: "User Logged out",
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Cannot logout" });
    return;
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(httpStatus.CONFLICT).json({ message: "Please provide an id" });
    }
    const user = await User.findOneAndDelete().orFail();
    res
      .status(httpStatus.OK)
      .json({ message: "user deleted successfully", user: user });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wrong", error: err });
  }
});

export const approveUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and update their status to "approved"
    const user = await User.findByIdAndUpdate(
      userId,
      { status: "approved" },
      { new: true } // Return the updated document
    );

    // Check if the user exists
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Send success response with the updated user data
    res.status(httpStatus.OK).json({
      message: "User approved successfully",
      user,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const rejectUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and update their status to "rejected"
    const user = await User.findByIdAndUpdate(
      userId,
      { status: "rejected" },
      { new: true } // Return the updated document
    );

    // Check if the user exists
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Send success response with the updated user data
    res.status(httpStatus.OK).json({
      message: "User rejected successfully",
      user,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "User with this email already exists",
      });
    }

    // Generate a temporary password (or use a token)
    const tempPassword = Math.random().toString(36).slice(-8); // Simple random password generation

    // Create the user
    const user = new User({
      name,
      email,
      password: tempPassword,
      status: "approved", // User status set to approved
    });

    await user.save();

    // Generate a token for password reset
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send an email to the user with a link to create their password
    const createPasswordLink = `${process.env.BASE_URL}/auth/resetPassword/${user._id}/${token}`;

    await sendAccountCreationEmailService(email, name, createPasswordLink);

    // Respond with success message
    res.status(httpStatus.CREATED).json({
      message:
        "User created successfully. An email with instructions to create a password has been sent.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});
