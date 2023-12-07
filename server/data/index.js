import dotenv from 'dotenv';
dotenv.config({ path: './../.env' });
import mongoose from 'mongoose';
import { users, posts } from './data.js';
import { chats, messages } from './dataMessage.js';
import User from './../models/User.js';
import Post from './../models/Post.js';
import Chat from './../models/Chat.js';
import Message from './../models/Message.js';

const mongodbURL = process.env.MONGODB_URL
                    .replace("<USERNAME>", process.env.MONGODB_USERNAME)
                    .replace("<PASSWORD>", process.env.MONGODB_PASSWORD)
                    .replace("<DB_NAME>", process.env.MONGODB_DB)

mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB: ", err);
        });
        
const insertData = async () => {
    try {
        //await User.create([...users]);
        //await Post.create([...posts]);
        await Chat.create([...chats]);
        await Message.create([...messages]);
        console.log("Inserted successfully");
    } catch (err) {
        console.log("Insert operation error: ", err);
    }
}

const deleteData = async () => {
    try {
        //await User.deleteMany({});
        //await Post.deleteMany({});
        await Chat.deleteMany({});
        await Message.deleteMany({});

        console.log("Deleted successfully");
    } catch (err) {
        console.log("Delete operation error: ", err);
    }
}

const args = process.argv.slice(2);
if (args[0] === "--insert") {
    insertData();
} else if (args[0] === "--delete") {
    deleteData();
};