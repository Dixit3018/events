const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const User = require("../models/user");

const {
  imagePathToBase64,
  getUserIdFromToken,
  filterSensitiveData,
} = require("../utils/utils");

//remove this afetr testing
const getUserProfileImage = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const image = imagePathToBase64(user.profilePicture);
    res.status(200).json({ image: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// update userProfile
const updateUser = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req)
    const userData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.username = userData.username;
    user.age = userData.age;
    user.email = userData.email;
    user.address = userData.address;
    user.state = userData.state;
    user.city = userData.city;

    const updatedUser = await user.save();
    updatedUser.profilePicture = imagePathToBase64(updatedUser.profilePicture);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: filterSensitiveData(updatedUser._doc),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserProfileImage, updateUser };
