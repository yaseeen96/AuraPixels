import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export const isAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Please provide a bearer token" });
    return;
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.headers.userId = verifiedToken._id;
    if (verifiedToken.role !== "Admin" && verifiedToken.role !== "SuperAdmin") {
      res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not authorised" });
      return;
    }
    if (verifiedToken.status != "approved") {
      res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not approved by the SuperAdmin" });
      return;
    }
    next();
  } catch (err) {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "You are not authorised" });
    return;
  }
};

export const isSuperAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Please provide a bearer token" });
    return;
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.headers.userId = verifiedToken._id;
    if (verifiedToken.role !== "SuperAdmin") {
      res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not authorised" });
      return;
    }
    next();
  } catch (err) {
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "You are not authorised" });
    return;
  }
};
