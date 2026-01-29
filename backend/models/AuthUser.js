// backend/models/AuthUser.js
import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema(
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

    role: {
      type: String,
      enum: ["admin", "guard"],
      required: true,
    },

    // ✅ NEW CONTACT FIELD
    contact: {
      type: String,   // phone number
      required: false // guard ke liye optional (tum true bhi kar sakte ho)
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const AuthUser = mongoose.model("AuthUser", authUserSchema);

export default AuthUser;
