const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
        data: {
          user,
          ...tokens,
        },
        message: "Login successful",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(500).json({ message: "Invalid refresh token" });
      }

      // Generate new access token
      const tokens = generateTokens(user._id);

      res.json({
        data: tokens,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  },
};

module.exports = authController;
