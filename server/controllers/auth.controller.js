import { User } from "../models/auth.model.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/hashUtils.js";

// ========================= REGISTER =========================
export const registerUserController = async (req, res) => {
  try {
    const { username, email, password, phone, location, bio, travelStyle } = req.body;

    // Only truly required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists", success: false });
    }

    const hashed = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashed,
      phone:       phone       || "",
      location:    location    || "",
      bio:         bio         || "",
      travelStyle: travelStyle || "",
    });

    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id:          newUser._id,
        username:    newUser.username,
        email:       newUser.email,
        travelStyle: newUser.travelStyle,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= LOGIN =========================
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:          user._id,
        username:    user.username,
        email:       user.email,
        travelStyle: user.travelStyle,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= LOGOUT =========================
export const logoutUserController = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully!" });
};

// ========================= PROFILE =========================
export const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Profile not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to load user." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { username, location, phone, bio, travelStyle } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, location, phone, bio, travelStyle },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, message: "Profile Updated Successfully!", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to Update Profile." });
  }
};