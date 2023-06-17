import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    role: String,
    token: String,
});

export const User = mongoose.model("user", userSchema);
