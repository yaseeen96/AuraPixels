import mongoose from "mongoose";

const wallpaperSchema = new mongoose.Schema(
  {
    imageTitle: {
      type: String,
      required: true,
    },
    screen: {
      type: String,
      enum: ["Mobile", "Desktop"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export const Wallpaper = mongoose.model("Wallpaper", wallpaperSchema);
