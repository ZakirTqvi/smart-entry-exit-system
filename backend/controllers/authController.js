// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthUser from "../models/AuthUser.js";

// Controller to create a new auth user
export const createAuthUser = async (req, res) => {
  try {
    const { name, email, password, role, contact } = req.body;

    // Check if user already exists
    const existingUser = await AuthUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new AuthUser({
      name,
      email,
      password: hashedPassword,
      role,
      contact
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        contact: newUser.contact
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login controller for auth user
export const loginAuthUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(400).json({ message: "User is inactive" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Guard reset password controller

export const resetPasswordByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password id required" });
    }

    const user = await AuthUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Admin ka password API se reset nahi hoga
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin password can only be reset via database",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate controller for guard

export const deactivateGuardByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await AuthUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety: admin can not be deacticated
    if (user.role === "admin") {
      return res.send(403).jsin({
        message: "Admin account cannot be deactivated",
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      message: "Guard deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate controller for guard
export const activateGuardByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await AuthUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety: admin can not be activated/deacticated
    if (user.role === "admin") {
      return res.send(403).json({
        message: "Admin account cannot be activated",
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      message: "Guard activated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all guards (for admin)

export const getAllGuards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await AuthUser.countDocuments({ role: "guard" });

    const guards = await AuthUser.find({ role: "guard" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      totalGuards: total,
      page,
      totalPages: Math.ceil(total / limit),
      guards
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


