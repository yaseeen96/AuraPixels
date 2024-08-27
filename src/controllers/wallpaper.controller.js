import asyncHandler from "express-async-handler";
import { Wallpaper } from "../models/Wallpaper/wallpaper.model.js";

import httpStatus from "http-status";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming you use Cloudinary for image uploads
import { wallpaperSchema } from "../schemas/wallpaperSchema.js";

export const createWallpaper = asyncHandler(async (req, res) => {
  try {
    const result = wallpaperSchema.safeParse(req.body);
    const owner = req.headers.userId;

    if (!result.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid input",
        error: result.error.errors, // Return detailed validation errors
      });
    }

    // Handle file upload
    let imageUrl = null;
    if (req.file) {
      const imagePath = req.file.path;
      const image = await uploadOnCloudinary(imagePath);
      if (image && image.url) {
        imageUrl = image.url;
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload image",
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Image file is required",
      });
    }
    const { imageTitle, screen, description, category } = result.data;

    // Create new wallpaper
    const wallpaper = new Wallpaper({
      imageTitle,
      screen,
      image: imageUrl,
      description,
      owner,
      category,
    });

    await wallpaper.save();

    res.status(httpStatus.CREATED).json({
      message: "Wallpaper created successfully",
      wallpaper,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const updateWallpaper = asyncHandler(async (req, res) => {
  try {
    const wallpaperId = req.params.id;
    const owner = req.headers.userId;

    // Validate the request body using zod's safeParse
    const result = wallpaperSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid input",
        errors: result.error.errors, // Return detailed validation errors
      });
    }

    // Find the existing wallpaper by ID
    const wallpaper = await Wallpaper.findById(wallpaperId);

    if (!wallpaper) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Wallpaper not found",
      });
    }

    // Ensure the user updating the wallpaper is the owner
    if (wallpaper.owner.toString() !== owner) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "You are not authorized to update this wallpaper",
      });
    }

    // Handle file upload if a new image is provided
    if (req.file) {
      const imagePath = req.file.path;
      const image = await uploadOnCloudinary(imagePath);
      if (image && image.url) {
        wallpaper.image = image.url;
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload image",
        });
      }
    }

    // Update wallpaper details
    const { imageTitle, screen, description, category } = result.data;

    wallpaper.imageTitle = imageTitle || wallpaper.imageTitle;
    wallpaper.screen = screen || wallpaper.screen;
    wallpaper.description = description || wallpaper.description;
    wallpaper.category = category || wallpaper.category;

    await wallpaper.save();

    res.status(httpStatus.OK).json({
      message: "Wallpaper updated successfully",
      wallpaper,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getAllWallpapers = asyncHandler(async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find()
      .populate({
        path: "owner",
        select: "name email", // Exclude the refreshToken field
      })
      .populate({ path: "category", select: "name" });

    res.status(httpStatus.OK).json({
      wallpapers,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getWallpaperById = asyncHandler(async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id)
      .populate({
        path: "owner",
        select: "name email", // Exclude the refreshToken field
      })
      .populate({ path: "category", select: "name" });

    if (!wallpaper) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Wallpaper not found",
      });
    }

    res.status(httpStatus.OK).json({
      wallpaper,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getWallpapersByCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Find all wallpapers with the specified category
    const wallpapers = await Wallpaper.find({ category: categoryId })
      .populate({
        path: "owner",
        select: "name email", // Exclude the refreshToken field
      })
      .populate({ path: "category", select: "name" });

    if (!wallpapers || wallpapers.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "No wallpapers found for this category",
      });
    }

    res.status(httpStatus.OK).json({
      wallpapers,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getWallpapersByOwner = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Find all wallpapers with the specified owner
    const wallpapers = await Wallpaper.find({ owner: ownerId })
      .populate({
        path: "owner",
        select: "name email", // Exclude the refreshToken field
      })
      .populate({ path: "category", select: "name" });

    if (!wallpapers || wallpapers.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "No wallpapers found for this owner",
      });
    }

    res.status(httpStatus.OK).json({
      wallpapers,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});
