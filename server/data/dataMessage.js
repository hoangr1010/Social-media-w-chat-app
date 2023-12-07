import mongoose from "mongoose";

const userIds = [
  '6524760eca6a0ef2f1680659',
  '6524760eca6a0ef2f168065c',
  '6524760eca6a0ef2f168065b',
  '6524760eca6a0ef2f168065a',
  '6524760eca6a0ef2f168065e',
  '6524760eca6a0ef2f168065f',
  '6524760eca6a0ef2f1680660',
  '6524760eca6a0ef2f168065d',
  '652477a182229a8f87c15801',
  '65471be2d06f7a64e1c99908',
];

const chatIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),  
]

const messageIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),  
];

export const chats = [
  {
    _id: chatIds[0],
    users: [
      { userId: userIds[0], newMessage: 3 },
      { userId: userIds[1], newMessage: 1 },
    ],
    lastMessage: messageIds[1],
    status: "offline",
  },
  {
    _id: chatIds[1],
    users: [
      { userId: userIds[2], newMessage: 2 },
      { userId: userIds[3], newMessage: 0 },
    ],
    lastMessage: messageIds[3],
    status: "offline",
  },
  {
    _id: chatIds[2],
    users: [
      { userId: userIds[4], newMessage: 1 },
      { userId: userIds[5], newMessage: 5 },
    ],
    lastMessage: messageIds[5],
    status: "offline",
  },
  {
    _id: chatIds[3],
    users: [
      { userId: userIds[6], newMessage: 0 },
      { userId: userIds[7], newMessage: 2 },
    ],
    lastMessage: messageIds[5],
    status: "offline",
  },
];

export const messages = [
  {
    _id: messageIds[0],
    chatId: chats[0]._id,
    sender: userIds[0],
    message: "Hey, how are you?",
  },
  {
    _id: messageIds[1],
    chatId: chats[0]._id,
    sender: userIds[1],
    message: "I'm good, thanks!",
  },
  {
    _id: messageIds[2],
    chatId: chats[1]._id,
    sender: userIds[2],
    message: "What's up?",
  },
  {
    _id: messageIds[3],
    chatId: chats[1]._id,
    sender: userIds[3],
    message: "Not much, just working.",
  },
  {
    _id: messageIds[4],
    chatId: chats[2]._id,
    sender: userIds[4],
    message: "Did you see the latest news?",
  },
  {
    _id: messageIds[5],
    chatId: chats[2]._id,
    sender: userIds[5],
    message: "Yes, it's quite interesting.",
  },
  {
    _id: messageIds[6],
    chatId: chats[3]._id,
    sender: userIds[6],
    message: "Hello, how's your day going?",
  },
  {
    _id: messageIds[7],
    chatId: chats[3]._id,
    sender: userIds[7],
    message: "It's going well, thanks!",
  },
];

