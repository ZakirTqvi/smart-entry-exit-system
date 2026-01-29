// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    
    
    role: {
      type: String,
      enum: ['student', 'teaching', 'non-teaching'],
      required: true
    },

    department: {
      type: String
    },

     // 🆕 Student ke liye
    rollNo: {
      type: String,
      default: null
    },

    // 🆕 Staff ke liye
    employeeId: {
      type: String,
      default: null
    },
    
    contact: {
      phone: {
        type: String
      },
      email: {
        type: String,
        unique: true
      }
    },

    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      pincode: {
        type: String
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
export default User;
