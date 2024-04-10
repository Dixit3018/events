const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.post("/chat-history", chatController.getChatHistory);

router.get("/get-single-user", chatController.getSingleUser);

router.get("/get-users", chatController.getAllUsers);

router.put("/create-message-instance", chatController.createMessageInstance);

module.exports = router;