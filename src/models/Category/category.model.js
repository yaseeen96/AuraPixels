import mongoose from "mongoose";
import { Wallpaper } from "../Wallpaper/wallpaper.model.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("remove", async function (next) {
  try {
    // 'this' refers to the category being deleted
    await Wallpaper.deleteMany({ category: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

export const Category = mongoose.model("Category", categorySchema);
