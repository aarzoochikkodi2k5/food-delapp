import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password." });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error during login." });
  }
};

// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (min 8 characters).",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // Send success response with message
    res.json({ success: true, token, message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error during registration." });
  }
};

export { loginUser, registerUser };

