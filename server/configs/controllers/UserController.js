import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================
// Register User: /api/user/register
// =======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        cartItems: user.cartItems || {}, // ✅ Include cartItems if needed
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// =======================
// Login User: /api/user/login
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        cartItems: user.cartItems || {}, // ✅ Include if you want to persist cart
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// =======================
// Check Auth: /api/user/is-auth
// Requires: authUser middleware
// =======================
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("isAuth Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// =======================
// Logout: /api/user/logout
// =======================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
