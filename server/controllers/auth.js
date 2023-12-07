import express from 'express';
import mongoose from "mongoose"
import User from "./../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, password, email, picturePath, friends, location, occupation } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            password: hash,
            email,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        })

        const savedUser = await newUser.save();
        delete savedUser.password;

        res.status(201).json({
            data: savedUser,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    };
};

export const login = async (req, res) => {
    try {    
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const match = await bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(401).json({message: 'Password is incorrect'});
        }

        delete user.password;
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(202).json({
            user,
            token
        })
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
};