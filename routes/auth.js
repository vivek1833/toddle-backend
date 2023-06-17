import express from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const router = express.Router();

router.get('/', async (req, res) => {
    // Check if user exists
    const { username, password, role } = req.body;
    const curruser = await User.findOne({ username: username });

    // If user exists, check password
    if (curruser) {
        if (curruser.password !== password) {
            res.status(400).json('Incorrect password');
        } else {
            const token = await User.findOne({ username: username }).select('token');
            res.status(200).json({ 'message': 'User already exists', 'token': token });
        }
    }

    // If user does not exist, create user
    else {
        const token = jwt.sign({ _id: req.body._id }, process.env.SecretKey);
        const newUser = new User({
            username: username,
            password: password,
            role: role,
            token: token
        });

        newUser.save();
        res.status(200).json({ 'message': 'User created', 'token': token });
    }
});

export { router as authRouter };
