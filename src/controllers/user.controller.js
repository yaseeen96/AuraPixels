import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import {
  loginSchema,
  signupSchema,
  userSchema,
} from "../schemas/userSchema.js";
import { User } from "../models/User/user.model.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmailService } from "../utils/sendMail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(httpStatus.NOT_ACCEPTABLE).json({
      message: "Please enter valid details",
      error: result.error,
    });
    return;
  }
  const { email, password, name } = result.data;
  try {
    // check if user exists
    const existedUser = await User.findOne({ email: email });

    if (existedUser) {
      res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
      return;
    }
    // create user
    const createdUser = await User.create({ email, password, name });
    const token = createdUser.generateAccessToken();
    const refreshToken = createdUser.generateRefreshToken();
    createdUser.refreshToken = refreshToken;
    createdUser.save();
    res.status(httpStatus.CREATED).json({
      message: "Account created successfully",
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error Adding to database", error: err });
  }
});

// login User

export const loginUser = asyncHandler(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(httpStatus.NOT_ACCEPTABLE).json({
      message: "Please enter valid details",
      error: result.error,
    });
    return;
  }
  try {
    const { email, password } = result.data;
    // check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "No user with email found" });
      return;
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Your password is incorrect" });
      return;
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save();

    return res
      .status(httpStatus.OK)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(httpStatus.FORBIDDEN).json({
      message: "You cannot logout. Please provide a valid Bearer token",
    });
    return;
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(verifiedToken);
    const user = await User.findById(verifiedToken._id);
    if (token !== user.refreshToken) {
      res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "Please provide a refresh token" });
      return;
    }
    await user.updateOne({ $unset: { refreshToken: 1 } });
    res.status(httpStatus.OK).json({ message: "Logged out" });
  } catch (err) {
    res.status(httpStatus.FORBIDDEN).json({
      message: "Token not valid",
    });
    return;
  }
});

export const sendPasswordResetEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(httpStatus.CONFLICT)
        .json({ message: "Please enter an email" });
      return;
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User with email not found" });
      return;
    }
    const password = user.password;

    const token = jwt.sign({ password }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1 days",
    });
    const url = `${process.env.BASE_URL}/auth/resetPassword/${user._id}/${token}`;
    const result = await sendPasswordResetEmailService(email, user.name, url);
    console.log(result);
    res.json({
      message: `password reset email has been sent to ${result.accepted[0]}`,
      url: url,
    });
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Couldnt send email. Something went wrong",
      error: err,
    });
    return;
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  if (!password) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "Please provide a password" });
    return;
  }
  const user = await User.findById(userId).select("+password");
  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Something went wrong. cant reset password" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.password !== user.password) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Link not valid or expired" });
      return;
    }

    user.password = password;
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    user.save();
    res.status(httpStatus.OK).json({
      message: "Password updated suceesfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Link Expired" });
    return;
  }
});

// todo: complete update profile

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;
    const userId = req.headers.userId;

    // Ensure userId is provided
    if (!userId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "UserId not provided" });
    }

    // Handle file upload
    let profileUrl = null;
    if (req.file) {
      const profilePath = req.file.path;
      const profile = await uploadOnCloudinary(profilePath);
      if (profile && profile.url) {
        profileUrl = profile.url;
      } else {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to upload profile picture" });
      }
    }

    const result = userSchema.safeParse({
      name,
      email,
      phone,
      bio,
      ...(profileUrl && { profile: profileUrl }),
    });
    if (!result.success) {
      res
        .status(httpStatus.CONFLICT)
        .json({ message: "Invalid input", error: result.error });
      return;
    }
    // Update user details
    await User.findByIdAndUpdate(userId, {
      $set: {
        name: name,
        email: email,
        phone: phone,
        bio: bio,
        profilePic: profileUrl,
      },
    }).orFail();

    res.status(httpStatus.OK).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  // step 2 - get user id. refer isAdminMiddleware to know where user id is
  // step 3 - get oldPassword and newPassword from req.body. if any is not send error response
  // step 4 - find user by id
  // step 5 - use defined mongoose method to check if old password is correct or not
  // step 6 - if old password is not correct throw error
  // step 7 - if old password is correct update password with new password. note - no need to hash it. It automatically gets hashed before saving

  const userId = req.headers.userId;
  console.log(userId);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "please provide old and new password" });
    return;
  }
  const user = await User.findById(userId).select("+password");
  console.log(user);

  const isCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isCorrect) {
    res
      .status(httpStatus.CONFLICT)
      .json({ message: "Old password does not match" });
    return;
  }
  user.password = newPassword;
  user.save();
  res.status(httpStatus.OK).json({ message: "Password changed successfully" });
});
