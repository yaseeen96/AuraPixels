import { Router } from "express";
import { isSuperAdminMiddleware } from "../../middlewares/auth.middleware.js";
import {
  approveUser,
  createUser,
  deleteUser,
  getAllUsers,
  rejectUser,
} from "../../controllers/superadmin.controller.js";

const superAdminRouter = Router();

superAdminRouter.use(isSuperAdminMiddleware);

superAdminRouter.get("/users", getAllUsers);

superAdminRouter.post("/approve/:id", approveUser);

superAdminRouter.post("/reject/:id", rejectUser);

superAdminRouter.post("/createUser", createUser);

superAdminRouter.delete("/user/:id", deleteUser);

export default superAdminRouter;
