const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
//register

const register = async (req, res) => {
    const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // Logic for user registration
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}



//login

const login = async (req, res) => {
    const { email, password } = req.body;
  try {
    // Logic for user login
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}



//logout



//auth middleware

module.exports = {
    register,
    login,
    // logout,
    // authMiddleware,
};