const user = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports = {
  create: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { email, phoneNumber, name, businessName, businessType, status } =
        req.body;
      let password = req.body?.password;
      if (!req.body?.password) {
        password = "12345678";
      }

      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          msg: "Required fields missing",
        });
      }

      if (email && email.trim() !== "") {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          return res.status(400).json({
            success: false,
            msg: "Invalid email format.",
          });
        }
      }

      // Check if user already exists
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          msg:
            existingUser.email === email
              ? "User with this email already exists"
              : "User with this phone number already exists",
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = {
        phoneNumber,
        name,
        role: "vendor",
        email,
        businessName,
        businessType,
        status,
        password: hashedPassword,
      };

      // Create and save the user
      const newUser = new user(userData);
      const savedUser = await newUser.save({ session });

      // Remove password from response
      const userResponse = savedUser.toObject();
      delete userResponse.password;

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        msg: "User details saved successfully",
        data: userResponse,
      });
    } catch (err) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();

      console.error("Error in user creation:", err);

      return res.status(500).json({
        success: false,
        msg: "An error occurred while creating the user.",
        error: err.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await user.find({ role: "vendor" });

      if (data.length === 0) {
        return res.status(404).json({ success: false, msg: "No user found" });
      }
      return res
        .status(200)
        .json({ success: true, msg: "user data fetched successfully", data });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const data = await user.findOne({ _id: req.params.id });
      console.log("data", data);

      if (!data) {
        return res.status(404).json({
          success: false,
          msg: "User not found",
        });
      }

      res.json({
        success: true,
        msg: "User details updated successfully",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if user exists
      const fiendedUser = await user.findById(userId);
      if (!fiendedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete the user
      await user.findByIdAndDelete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Check if the user exists
      const foundUser = await user.findById(userId).session(session);
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if the email is already in use by another user
      if (updateData.email) {
        const existingUser = await user
          .findOne({
            _id: { $ne: userId },
            email: updateData.email,
          })
          .session(session);

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already in use by another user",
          });
        }
      }

      // Prevent role modification
      if (updateData.role && updateData.role !== foundUser.role) {
        return res.status(400).json({
          success: false,
          message: "Role cannot be changed through this endpoint",
        });
      }

      // Update user details
      const updatedUser = await user.findByIdAndUpdate(
        userId,
        {
          $set: {
            name: updateData.name,
            phoneNumber: updateData.phoneNumber,
            businessName: updateData.businessName,
            businessType: updateData.businessType,
            status: updateData.status,
          },
        },
        { new: true, session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          msg: "Email is required",
        });
      }

      // Find user by email
      const foundUser = await user.findOne({ email });
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          msg: "User not found with this email",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

      // Save reset token to user
      foundUser.resetPasswordToken = resetToken;
      foundUser.resetPasswordExpires = resetTokenExpiry;
      await foundUser.save();

      // Create email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Reset password URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send email
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
          <p>This link will expire in 1 hour</p>
          <p>If you didn't request this, please ignore this email</p>
        `,
      });

      res.status(200).json({
        success: true,
        msg: "Password reset link sent to email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        msg: "Error in forgot password process",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          msg: "Token and new password are required",
        });
      }

      // Find user with valid reset token
      const foundUser = await user.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!foundUser) {
        return res.status(400).json({
          success: false,
          msg: "Invalid or expired reset token",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password and clear reset token
      foundUser.password = hashedPassword;
      foundUser.resetPasswordToken = undefined;
      foundUser.resetPasswordExpires = undefined;
      await foundUser.save();

      res.status(200).json({
        success: true,
        msg: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        msg: "Error in reset password process",
        error: error.message,
      });
    }
  },
};
