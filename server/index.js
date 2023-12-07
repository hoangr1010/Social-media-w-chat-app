import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import { register } from "./controllers/auth.js";
import authRouter from './Routes/auth.js';
import userRouter from './Routes/user.js';
import postRouter from './Routes/post.js';
import chatRouter from './Routes/chat.js';
import { verifyToken } from './middleware/auth.js';
import { uploadFile } from './middleware/fileUpload.js';
import { createPost } from './controllers/post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let server;

// CONFIGURATION
const app = express();

app.use(cors());
dotenv.config();
app.use(helmet());
app.use(express.json())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));


// MULTER STORAGE SETUP
// const storage = multer.diskStorage({
//     destination: (req,file,cb) => {
//         cb(null, 'public/assets');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

const upload = multer({ storage: multer.memoryStorage() })

app.post('/auth/register', upload.single("picture"), uploadFile, register);
app.post('/posts', verifyToken, upload.single("picture"), uploadFile, createPost);

// ROUTER HANLER
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/chat', chatRouter);


// CONNECT TO MONGODB DATABASE
const mongodbURL = process.env.MONGODB_URL
                    .replace("<USERNAME>", process.env.MONGODB_USERNAME)
                    .replace("<PASSWORD>", process.env.MONGODB_PASSWORD)
                    .replace("<DB_NAME>", process.env.MONGODB_DB)

await mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to MongoDB");

            // LISTEN SERVER
            server = app.listen(process.env.PORT, () => {
                console.log("listening on port " + process.env.PORT)
            });
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB: ", err);
        });

// SOCKET SETTINGS
const io = new Server(server, {
    pingTimeout: 6000,
    cors: {
        origin: process.env.CLIENT_URL
    }
})

io.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('chatSetup', (chatIdList) => {
        socket.join(chatIdList);
        socket.emit('chatSetup', "successfully set up chat socket")
    })

    socket.on('newMessage', (messageObject) => {
        console.log(socket.rooms)
        console.log(messageObject.chatId)
        socket.to(messageObject.chatId).emit(messageObject);
    })
})