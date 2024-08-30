import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import authRouter from "./routes/Auth/auth.route.js";
import {
  isAdminMiddleware,
  isSuperAdminMiddleware,
} from "./middlewares/auth.middleware.js";
import superAdminRouter from "./routes/Superadmin/superadmin.route.js";
import categoryRouter from "./routes/Category/category.route.js";
import wallpaperRouter from "./routes/Wallpaper/wallpaper.route.js";

import swaggerUiExpress from "swagger-ui-express";
import APISpecs from "./utils/swagger.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// add swagger configuration
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(APISpecs));

app.use("/auth", authRouter);
app.use("/superAdmin", superAdminRouter);
app.use("/category", categoryRouter);
app.use("/wallpaper", wallpaperRouter);
// status check
app.get("/status", (req, res) => {
  res.json({ status: "working" }).status(200);
});

export { app };

// openAPI docs

/**
 * @swagger
 *  tags:
 *    - name: Authentication
 *      description: Authentication Endpoints
 * 
 *    - name: SuperAdmin
 *      description: The operations performed by the SuperAdmin
 * 
 *    - name: Categories
 *      description: Operations on Categories
 * 
 *    - name: Wallpapers
 *      description: Operations on Wallpapers
 * 
 
 */
