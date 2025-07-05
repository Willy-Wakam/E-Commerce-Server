const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

require("dotenv").config();
//register

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({
        success: false,
        error: "Email or Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };
    const savedUser = await User.create(newUser);
    return res.json({
      message: "User registered successfully",
      user: savedUser,
      success: true,
    });
  } catch (error) {
    // Handle other errors
    throw error;
  }
};

//login

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User doesn't exist! Please register",
        success: false,
      });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ error: "Invalid password or Email", success: false });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION, // Token expiration time
      }
    );
    // Set token in cookies
    return res
      .cookie("token", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Helps prevent CSRF attacks
      })
      .json({
        message: "User logged in successfully",
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.json({ error: "Login failed" });
  }
};

//logout
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    res.json({ error: "Logout failed", success: false });
  }
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized access", success: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        username: decoded.username
        // You can add more user info if needed
    }; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid token", success: false });
  }
};

module.exports = {
  register,
  login,
  logout,
  authMiddleware,
};
