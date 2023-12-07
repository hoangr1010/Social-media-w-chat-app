import express from 'express';
import User from './../models/User.js';

export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        res.status(200).json({
            user: user
        })
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        // const promiseArray = user.friends.map((friendId) => findById(friendId));
        // const friendArray = await Promise.all(promiseArray);
        // const formattedArray = friendArray.map((friend) => {
        //     _id: friend._id;
        //     firstName: friend.firstName;
        //     lastName: friend.lastName;
        //     picturePath: friend.picturePath;
        //     occupation: friend.occupation;
        //     location: friend.location
        // })

        res.status(200).json({
            friends: user.friends
        });

    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }

};

export const addRemoveFriend = async (req, res) => {
    try {
        // get user and friend profile
        const userId = req.params.id;
        const friendId = req.params.friendId;
        
        // check if they are friend
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // if they are friend -> remove
            user.friends = user.friends.filter((frId) => {
                return frId != friendId;
            })

            friend.friends = friend.friends.filter((frId) => {
                return frId != userId;
            })

        } else {
            // if they are not friend -> add 
            user.friends.push(friendId);
            friend.friends.push(userId);
        }        

        // update both user and friend profile in DB

        const newUser = await User.findByIdAndUpdate(userId, user, { new: true });
        const newFriend = await User.findByIdAndUpdate(friendId, friend, { new: true });
        
        // // format friend list 

        // const friendArray = await Promise.all(newUser.friends.map((frId) => User.findById(frId)));
        // const formattedFriendArray = friendArray.map(({ _id, firstName, lastName, picturePath, occupation, location }) => {
        //     return { _id, firstName, lastName, picturePath, occupation, location }
        // })

        res.status(200).json({
            friends: newUser.friends
        })

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};