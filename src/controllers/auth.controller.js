const User = require("../models/User.moduls");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookies = require("cookie-parser");
const emailservices = require("../services/email.service");

// --- REGISTER CONTROLLER ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email});
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }
    
    const hashpassword = bcrypt.hashSync(password, 10);
    
    // 2. Create new user
    const newUser = await User.create({ name, email, password: hashpassword });

    // 3. Generate Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // FIX 1: Express uses res.cookie(), not res.cookies.set()
    res.cookie("token", token, { httpOnly: true }); 

    // FIX 2: Send the response LAST. Move email service above or remove await if it's non-blocking.
    try {
      await emailservices.userRegisterationEmail(email, name);
    } catch (emailError) {
      console.error("Email failed to send:", emailError.message);
    }

    return res.status(201).json({
      status: "success",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

// --- LOGIN CONTROLLER ---
exports.login  = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await Usermodel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email and password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User logged in successfully' 
      ,user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (error) { 
    console.log(error);
    res.status(500).json({ message: 'Server error in loginUser constroller' });
  }
};

// --- LOGOUT CONTROLLER ---
exports.logout = (req, res) => {
  // Clear the cookie by overwriting it with an immediate expiration date
  res.clearCookie("token");

  res
    .status(200)
    .json({ status: "success", message: "Successfully logged out." });
};
