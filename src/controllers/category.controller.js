import { Category } from "../models/Category/category.model.js";
import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming you have this utility function

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    // Ensure name is provided
    if (!name) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Category name is required",
      });
    }

    // Handle file upload
    let coverImageUrl = null;
    if (req.file) {
      const coverImagePath = req.file.path;
      const coverImage = await uploadOnCloudinary(coverImagePath);
      if (coverImage && coverImage.url) {
        coverImageUrl = coverImage.url;
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload cover image",
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Cover image is required",
      });
    }

    // Create new category
    const category = new Category({
      name,
      coverImage: coverImageUrl,
    });

    await category.save();

    res.status(httpStatus.CREATED).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(httpStatus.OK).json({
      categories,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    res.status(httpStatus.OK).json({
      category,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    // Handle file upload
    let coverImageUrl = category.coverImage;
    if (req.file) {
      const coverImagePath = req.file.path;
      const coverImage = await uploadOnCloudinary(coverImagePath);
      if (coverImage && coverImage.url) {
        coverImageUrl = coverImage.url;
      } else {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload cover image",
        });
      }
    }

    // Update category details
    category.name = name || category.name;
    category.coverImage = coverImageUrl;
    await category.save();

    res.status(httpStatus.OK).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    // The pre('remove') hook will automatically delete associated wallpapers

    res.status(httpStatus.OK).json({
      message: "Category and associated wallpapers deleted successfully",
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});
