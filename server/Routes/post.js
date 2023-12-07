import express from 'express';
import { verifyToken } from './../middleware/auth.js';
import { getFeedPosts, getUserPosts, likePost, commentPost } from './../controllers/post.js'

const postRouter = express.Router();

postRouter.get('/', verifyToken, getFeedPosts);
postRouter.get('/:userId/posts', verifyToken, getUserPosts);
postRouter.patch('/:id/like', verifyToken, likePost);
postRouter.patch('/:id/comment', verifyToken, commentPost);

export default postRouter;