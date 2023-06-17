import mongoose from "mongoose";

const journal = new mongoose.Schema({
    teacher: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    students: [{
        type: String,
        required: true,
    }],
    published_at: {
        type: Date,
        required: true,
    },
    attachment: {
        type: String,
        required: true,
    },
});

export const Journal = mongoose.model("Journal", journal);
