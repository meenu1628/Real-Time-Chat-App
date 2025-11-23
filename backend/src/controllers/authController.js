import { get } from "mongoose";
import { createOtp, verifyOtpAndGetUser } from "../queries/otp.js";
import { verifyPasswordUsingUsernameOrEmail, isEmailExists, isUsernameExists, createUser, getUserById } from "../queries/user.js";
import generateEmail from "../utils/generateEmail.js";
import generateOtp from "../utils/generateOtp.js";
import { generateTokenAndSetCookie } from "../utils/token.js";
import bcrypt from "bcryptjs";

const validateSignUpData = async (data) => {
  const { fullname, username, email, password, confirmPassword } = data;
  if (!fullname || !username || !email || !password || !confirmPassword) {
    return { isValid: false, error: "All fields are required" };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return { isValid: false, error: "Username can only contain letters and numbers" };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  if (await isEmailExists(email)) {
    return { isValid: false, error: "Email already exists" };
  }
  if (await isUsernameExists(username)) {
    return { isValid: false, error: "Username already exists" };
  }
  return { isValid: true };
}


export const signup = async (req, res) => {
  try {

    const validation = await validateSignUpData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    const { fullname, username, email, password } = req.body;
    const newOtp = generateOtp();
    const otpData = {
      fullname,
      username,
      email,
      password: await bcrypt.hash(password, 8),
      otp: await bcrypt.hash(newOtp, 8),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };
    const otpId = await createOtp(otpData);
    // Here you would typically send the OTP to the user's email
    if (otpId) {
      await generateEmail(email, "Verify your email", newOtp);
      res.status(201).json({ message: "Verify your email to complete the signup" });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }

  } catch (e) {
    console.log("Error in singup controller " + e.message);
    res.status(500).json({ error: "Internal Server error " });
  }
};



export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Username/Email and password are required" });
    }

    const user = await verifyPasswordUsingUsernameOrEmail(usernameOrEmail, password);
    if (!user) {
      return res.status(400).json({ error: "Invalid username/email or password" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ user: user, message: "Login successful" });
  }
  catch (e) {
    console.log("Error in login controller " + e.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    console.log("Error in logout controller " + e.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const userData = await verifyOtpAndGetUser(email, otp);
    if (userData) {
      const userId = await createUser(userData);
      if (userId) {
        res.status(200).json({ message: "OTP verified successfully" });
      }
    }
  } catch (e) {
    console.log("Error in verifyOtp controller " + e.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await getUserById(id);

    res.status(200).json({
      user: user,
    });
  } catch (e) {
    console.log("Error in getCurrentUser controller " + e.message);
    res.status(500).json({ error: "Internal Server error" });
  }
}

