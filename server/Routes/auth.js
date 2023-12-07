import express from 'express';
import { login } from './../controllers/auth.js'
import { verifyToken } from "./../middleware/auth.js"
import bodyParser from "body-parser";

const authRouter = express.Router();

authRouter.post('/login', login);

export default authRouter;