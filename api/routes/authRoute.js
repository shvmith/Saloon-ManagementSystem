import express from "express";
import {
  signOut,
  login,
  signup,
  getCurrentUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/signout", signOut);
router.get("/me", verifyToken, getCurrentUser);

export default router;
