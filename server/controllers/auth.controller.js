import { User } from "../models/auth.model.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/hashUtils.js";

export const registerUserController = async (req, res) => {
  try {
    const { username, email, password, phone, location, role } = req.body;

    if (!username || !email || !password || !phone || !location || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success:false
      });
    }

    const hashed = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashed,
      phone,
      location,
      role,
    });

    const token = generateToken(newUser);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================= LOGIN =========================
export const loginUserController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    if (user.role !== role) {
      return res.status(403).json({
        message: "Incorrect role selected",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = generateToken(user);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const logoutUserController = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};


export const getUserProfile = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const { username, location, phone } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    

    

    const updatedData = { username, location, phone };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Update Profile.",
    });
  }
};