import express from "express";
import {
  loginUser,
  registerUser,
  upload,
} from "../controllers/authController.js";

const router = express.Router();
// REGISTER API
router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);

export default router;
