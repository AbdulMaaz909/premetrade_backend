import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", // default placeholder image
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
