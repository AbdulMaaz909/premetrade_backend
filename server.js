import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"
import taskRouter from "./routes/taskRoutes.js"


const app = express();
dotenv.config();
// Middlewares
app.use(express.json());
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/user/',userRouter);
app.use('/api/task',taskRouter);


// Start Server + DB
connectDB();
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
