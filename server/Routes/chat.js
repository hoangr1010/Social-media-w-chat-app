import express from 'express';
import { verifyToken } from './../middleware/auth.js';
import { getChat, getMessage, sendMessage, createChat, updateNewMessage } from './../controllers/chat.js';

const chatRouter = express.Router();

chatRouter.get("/:userId", verifyToken, getChat);
chatRouter.get("/message/:chatId", verifyToken, getMessage);
chatRouter.post("/:senderId/:chatId", verifyToken, sendMessage);
chatRouter.post('/', verifyToken, createChat);
chatRouter.patch('/newMessage/:chatId/:userId/:action', verifyToken, updateNewMessage);

export default chatRouter;