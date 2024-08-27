import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "../../controllers/user.controller.js";
import { isAdminMiddleware } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
const authRouter = Router();

authRouter.post("/signup", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", logoutUser);

// step 1 - add isAdminMiddleware

authRouter.post("/changePassword", isAdminMiddleware, changePassword);

authRouter.post(
  "/updateProfile",
  isAdminMiddleware,
  upload.single("profile"),
  updateProfile
);

authRouter.post("/forgotPassword", sendPasswordResetEmail);

authRouter.patch("/resetPassword/:userId/:token", resetPassword);

export default authRouter;
