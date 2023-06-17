import { verify } from "jsonwebtoken";
import env from "dotenv";
env.config();
import { User } from "../models/user.js";

const teacherAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) {
            res.status(401).json("No token provided");
        }
        const verifyUser = verify(token, process.env.SecretKey);
        if (!verifyUser) {
            res.status(402).json("No token provided");
        }
        const currUser = await User.findOne({ token: token, role: "teacher" });

        if (!currUser) {
            res.status(401).json("No teacher found");
        }

        req.token = token;
        req.user = currUser;
        req.id = currUser._id;
        next();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { teacherAuth };
