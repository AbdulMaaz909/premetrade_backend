import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { json } from "stream/consumers";

const registerUser = async (req, res) => {
  try {
    // log incoming body/file for easier debugging (inspect multipart vs json)
    console.log("registerUser - req.body:", req.body, "req.file:", req.file);

    const { name, email, password, photo } = req.body || {};

    // basic validation before attempting to create user
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save photo if uploaded
    const photoUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      photo: photoUrl,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        photo: newUser.photo,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //    1.check if user is exist
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password " });

    //2.compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Email or Password" });

    //3.create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //4.send response
    res.json({
      message: "Login Successfull",
      token,
      photo:user?.photo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // create folder if not exists
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1690000000.png
  },
});

export const upload = multer({ storage });

// PUT /update-profile/:id

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // req.body contains only text fields
    const { name } = req.body;

    // req.file contains the uploaded photo (if sent)
    let photoPath;
    if (req.file) {
      photoPath = req.file.path; // e.g. uploads/12345_photo.png
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (photoPath) updateData.photo = photoPath;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { registerUser, loginUser };
