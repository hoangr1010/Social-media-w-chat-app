import Chat from './../models/Chat.js';
import Message from './../models/Message.js';
import User from './../models/User.js';

export const getChat = async (req, res) => {
    try {
        const userId = req.params.userId;

        let chats = await Chat
            .find({ "users.userId" : userId })
            .populate({
                path: 'lastMessage',
                select: '_id sender message createdAt'
            });

        // create a list of promises that contains promise formatted Chat
        const chatPromises = chats.map(async (chat) => {

            const rootUser = (chat.users[0].userId == userId) ? chat.users[0] : chat.users[1];
            const other = (chat.users[0].userId != userId) ? chat.users[0] : chat.users[1];
            const otherProfile = await User.findById(other.userId).select('_id firstName lastName picturePath');
    
            const formattedChat = {
                chatId: chat._id,
                other: otherProfile,
                status: chat.status,
                newMessage: rootUser.newMessage,
                lastMessage: chat.lastMessage,
            }
            return formattedChat;
        })    
        
        const formattedChats = await Promise.all(chatPromises);
        
        res.status(200).send({ chats: formattedChats });

    } catch (err) {
        res.status(400).send({ message: err.message });
    }

};

export const getMessage = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        
        const messages = await Message
            .find({ chatId: chatId })
            .select('_id sender message createdAt')
            .populate({
                path: 'sender',
                select: '_id picturePath'
            })
            .sort('createdAt');

        res.status(200).send({ messages: messages });
    } catch(err) {
        res.status(200).send({ message: err.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { senderId, chatId } = req.params;
        const message = req.body.message;
    
        // Check if sender is in chat
        const chat = await Chat.findById(chatId);

        if (chat.users[0].userId != senderId && chat.users[1].userId != senderId) {
            throw new Error("sender is not in chat");
        }
        
        // Save message
        const newMessage = await Message
            .create({
                chatId: chatId,
                sender: senderId,
                message: message,
        });
        await newMessage
            .populate({
                path: 'sender',
                select: '_id picturePath'
            })
        
        // Update last message in Chat
        const updatedChat = await Chat
            .findByIdAndUpdate(chatId, { lastMessage: newMessage._id }, { new: true })
            .populate({
                path: 'lastMessage',
                select: '_id createdAt message sender'
            })
            

        res.status(200).send({newMessage,updatedChat});

    } catch (err) {
        res.status(400).send({message: err.message});
    }
};

export const createChat = async (req, res) => {
    try {
        const participants = req.body.participants;

        // if no participants, error creating
        if (participants.length < 1) {
            throw new Error('Participants must be at least 1');
        }

        const users = participants.map(participantId => {
            return { userId: participantId }
        })

        // Check if the chat exists
        const queryArray = participants.map(participantId => {
            return { "users.userId": participantId };
        })

        const chatWithUsers = await Chat.find({
            $and: queryArray
        })

        chatWithUsers.forEach(chat => {
            if (chat.users.length == participants.length) {
                throw new Error("Chat already exists");
            }
        })

        // Create new chat
        const newChat = await Chat.create({
            users: users,
        })

        res.status(200).send({newChat});

    } catch (err) {
        res.status(400).send({message: err.message});
    }

};

