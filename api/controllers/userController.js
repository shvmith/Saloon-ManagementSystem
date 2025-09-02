import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const getAllUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });

  res.status(200).json(users);
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if email is already in use by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use by another account",
      });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run model validation
      }
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Server error occurred while updating profile",
      error: error.message,
    });
  }
};

// Delete User Account
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Optional: Delete related data (appointments, bookings, etc.)
    // await Appointment.deleteMany({ userId: id });
    // await Booking.deleteMany({ userId: id });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Server error occurred while deleting account",
      error: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  const { fullname, email, password, mobile, position, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Determine if the user is a manager based on usertype

    // Create a new user
    const newUser = new User({
      name: fullname,
      email,
      password: hashedPassword,
      phone: mobile,
      position,
      role,
      status: "active",
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
