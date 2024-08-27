import { Router } from "express";
import {
  createWallpaper,
  getAllWallpapers,
  getWallpaperById,
  getWallpapersByCategory,
  getWallpapersByOwner,
  updateWallpaper,
} from "../../controllers/wallpaper.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { isAdminMiddleware } from "../../middlewares/auth.middleware.js";

const wallpaperRouter = Router();

wallpaperRouter.post(
  "/create",
  isAdminMiddleware,
  upload.single("image"),
  createWallpaper
);
wallpaperRouter.post(
  "/update/:id",
  isAdminMiddleware,
  upload.single("image"),
  updateWallpaper
);
wallpaperRouter.get("/all", getAllWallpapers);

wallpaperRouter.get("/:id", getWallpaperById);
wallpaperRouter.get("/category/:categoryId", getWallpapersByCategory);
wallpaperRouter.get("/owner/:ownerId", getWallpapersByOwner);
export default wallpaperRouter;
