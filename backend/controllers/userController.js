// backend/controllers/userController.js
import User from "../models/User.js";
import FaceEncoding from "../models/FaceEncoding.js";

/**
 * @desc    Create student / teaching / non-teaching user
 * @route   POST /api/users/create
 * @access  Admin only
 */

export const createUser = async (req, res) => {
  try {
    const {
      name,
      role,
      department,
      rollNo,
      employeeId,
      contact = {},
      address = {}
    } = req.body;

    const { phone, email } = contact;
    const { line1, line2, city, state, pincode } = address;

    /* ================= BASIC VALIDATION ================= */
    if (!name?.trim() || !role || !email?.trim()) {
      return res.status(400).json({
        message: "Name, role and email are required"
      });
    }

    if (!["student", "teaching", "non-teaching"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified"
      });
    }

    /* ================= ROLE BASED VALIDATION ================= */
    if (role === "student" && !rollNo) {
      return res.status(400).json({
        message: "Roll number is required for students"
      });
    }

    if ((role === "teaching" || role === "non-teaching") && !employeeId) {
      return res.status(400).json({
        message: "Employee ID is required for staff"
      });
    }

    /* ================= DUPLICATE EMAIL CHECK ================= */
    const existingUser = await User.findOne({ "contact.email": email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    /* ================= CREATE USER ================= */
    const user = await User.create({
      name,
      role,
      department,
      rollNo: role === "student" ? rollNo : null,
      employeeId:
        role === "teaching" || role === "non-teaching" ? employeeId : null,
      contact: {
        phone,
        email
      },
      address: {
        line1,
        line2,
        city,
        state,
        pincode
      },
      isActive: true
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Admin
 */

export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

     // Load all face encodings to check which users have registered faces 
    const faceEncodings = await FaceEncoding.find().select('userId');
   
    const faceMap = new Set(
      faceEncodings.map(fe => fe.userId.toString()) 
    );

    const usersWithFaceStatus = users.map(user => ({
      ...user.toObject(),
      hasFaceRegistered: faceMap.has(user._id.toString())
    }));
    

    res.json({
      users: usersWithFaceStatus,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Activate / Deactivate user
 * @route   PATCH /api/users/:id/status
 * @access  Admin
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false"
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User status updated",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


