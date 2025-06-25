const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
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
    return res
      .json({ message: "User registered successfully", user: savedUser, success: true });
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
      return res
        .json({ error: "User doesn't exist! Please register", success: false });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ error: "Invalid password or Email", success: false });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
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
    // Logic for user login
    res.json({ message: "User logged in successfully" });
  } catch (error) {
    res.json({ error: "Login failed" });
  }
};

//logout

//auth middleware

module.exports = {
  register,
  login,
  // logout,
  // authMiddleware,
};
