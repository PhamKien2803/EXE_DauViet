// controllers/authController.js
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { redisClient }= require("../config/redisClient");

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "exe_201";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "exe_201";

exports.loginAccount = async (req, res) => {
  try {
    console.log("🚀 ~ exports.loginAccount= ~ req.body", req.body)
    const { username, password } = req.body;
    console.log("🚀 ~ exports.loginAccount= ~ username, password:", username, password)
    
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter username and password" });
    }

    const user = await User.findOne({ username, active: true});
    if (!user) {
      return res.status(404).json({ message: "Account not registered!" });
    }
    console.log("🚀 ~ exports.loginAccount= ~ user:", user)

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Username or password is incorrect!" });
    }
    const accessToken = jwt.sign(
      { id: user._id},
      ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    await redisClient.set(user._id.toString(), refreshToken, {
      EX: 7 * 24 * 60 * 60 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.register = async (req, res) => {
  try {
    const { username, email, password, role} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }], active: true
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const newAccount = new User({
      username,
      email,
      password,
      role
    });

    await newAccount.save();
    res.status(201).json({ message: "Account created successfully", account: newAccount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


exports.logoutAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await redisClient.del(userId.toString());

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getInformationAccount = async (req, res) => {
    try {
        const accountId = req.user.id;
        console.log("accountId", accountId);

        const account = await User.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        return res.status(200).json(account);

    } catch (err) {
        console.error("getInformationAccount error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}