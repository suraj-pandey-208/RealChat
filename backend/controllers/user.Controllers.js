import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("GET CURRENT USER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
};

// EDIT PROFILE
export const editProfile = async (req, res) => {
  try {
    console.log("BODY =", req.body);

    const { name } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path);
      updateData.image = image;
    }

    console.log("UPDATE DATA =", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      {
        returnDocument: "after",
      }
    ).select("-password");

    console.log("UPDATED USER =", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("EDIT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET OTHER USERS
export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log("GET OTHER USERS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

//SEARCH USERS
export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `search user others ${error}` });
  }
};