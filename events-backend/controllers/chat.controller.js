const ChatData = require("../models/chatData");
const User = require("../models/user");
const { getUserIdFromToken, imagePathToBase64 } = require("../utils/utils");

const getChatHistory = async (req, res) => {
  const sender_id = getUserIdFromToken(req)  
  const { recipent_id } = req.body;
  
    try {
      const chatHistory = await ChatData.findOne(
        { participants: { $all: [sender_id, recipent_id] } },
        { messages: 1 }
      );
  
      if (!chatHistory) {
        return res.status(200).json({ chatHistory: [] });
      }
  
      return res.status(200).json({ chatHistory });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

const getSingleUser = async (req, res) => {
    try {
      const id = req.query.id;
      const user = await User.findOne({ _id: id });
  
      if (user) {
        user.profilePicture = await imagePathToBase64(user.profilePicture);
      }
      res.status(200).json({ user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }

const getAllUsers = async (req, res) => {
    const id = getUserIdFromToken(req);
 
    let users = await User.find({ _id: { $ne: id } });

    for (const user of users) {
        user.profilePicture = imagePathToBase64(user.profilePicture);
    }
    users = users.map((user) => ({ ...user.toObject() }));
  
    if (users) {
      return res.status(200).json({ users: users });
    } else {
      return res.status(500).json({ err: "something went wrong" });
    }
  }
  module.exports = { getChatHistory, getSingleUser, getAllUsers }