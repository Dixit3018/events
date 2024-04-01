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
 
    const chatData = await ChatData.find({ participants: { $in: [id] } });
    
    const users = chatData
    .filter(data => {
      return data.participants.includes(id) && data.participants.length === 2;
    })
    .map(data => {
      return data.participants.find(participantId => participantId !== id);
    });
    
    let participatedUsers = await User.find({ _id: { $in: users.map(id => id)  } });

    for (const user of participatedUsers) {
        user.profilePicture = imagePathToBase64(user.profilePicture);
    }
    participatedUsers = participatedUsers.map((user) => ({ ...user.toObject() }));
  
    if (participatedUsers) {
      return res.status(200).json({ users: participatedUsers });
    } else {
      return res.status(500).json({ err: "something went wrong" });
    }
  }

const createMessageInstance = async (req,res) => {
  senderId = await getUserIdFromToken(req);
  const { recieverId } = req.body;

  const participants = [senderId, recieverId]

  const chat = await ChatData.findOne({
    participants: { $all: participants },
  });

  console.log(chat);
  if(!chat) {
    await ChatData.create({
      participants:participants 
    })
    return res.status(204).json({ status: 'success'})
  }
  return res.status(204).json({ status: 'exists'})

}
  module.exports = { getChatHistory, getSingleUser, getAllUsers, createMessageInstance }