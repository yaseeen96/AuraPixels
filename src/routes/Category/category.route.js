import { Router } from "express";
import {
  isAdminMiddleware,
  isSuperAdminMiddleware,
} from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { createUser } from "../../controllers/superadmin.controller.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/all", getAllCategories);

categoryRouter.post(
  "/create",
  isSuperAdminMiddleware,
  upload.single("cover"),
  createCategory
);

categoryRouter.post("/reject/:id");

categoryRouter.post(
  "/update/:id",
  isSuperAdminMiddleware,
  upload.single("cover"),
  updateCategory
);

categoryRouter.delete("/delete/:id", isSuperAdminMiddleware, deleteCategory);

export default categoryRouter;
