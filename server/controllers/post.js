import Post from './../models/Post.js';
import User from './../models/User.js';

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;

        // get user information
        const user = await User.findById(userId);

        // create new post
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            picturePath,
            description,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        });

        // save to database
        await newPost.save()

        // return list of posts (userID)
        const userPosts = await Post.find();

        res.status(200).json({ userPosts });

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
};

export const getFeedPosts = async (req, res) => {

    try {
        const posts = await Post.find();

        res.status(200).json({ posts });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ userId: userId });
        
        res.status(200).json({ posts });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;

        const post = await Post.findById(postId);
        
        if (post.likes.get(userId)) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId,true);
        }

        const newPost = await Post.findByIdAndUpdate(postId, { likes: post.likes }, { new: true });

        res.status(200).json({ newPost });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comment = req.body.comment;

        const post = await Post.findById(postId);
        post.comments.push(comment);

        const newPost = await Post.findByIdAndUpdate(postId, {comments: post.comments}, {new: true});
        res.status(200).json({ newPost });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};