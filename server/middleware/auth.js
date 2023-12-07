import express from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next)  => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            res.status(401).json({ message: "Access denied" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).send({ message: err.message });
    }
}