import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import env from 'dotenv';
env.config();

import { Journal } from '../models/journal.js';
import { teacherAuth } from '../middleware/teacherauth.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.CloudKey,
    api_secret: process.env.CloudSecret
});
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storage }).single('file');

// For the teacher, the teacher can create a journal
router.post('/create', upload, teacherAuth, async (req, res) => {
    const { description, students, published_at } = req.body;
    const uploadimg = await cloudinary.uploader.upload(req.file.path);

    if (!description || !students || !published_at)
        return res.status(401).json({ message: "Enter all fields" });

    try {
        const date = new Date(published_at);
        const journal = new Journal({
            teacher: req.id,
            description,
            students,
            published_at: date,
            attachment: uploadimg.secure_url
        });
        await journal.save();
        res.status(200).json(journal);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

// For the teacher, the teacher can update a journal
router.put('/update/:id', teacherAuth, upload, async (req, res) => {
    const updateArr = {};
    if (req.body.description)
        updateArr.description = req.body.description;
    if (req.body.students)
        updateArr.students = req.body.students;
    if (req.body.published_at) {
        const date = new Date(req.body.published_at);
        updateArr.published_at = date;
    }
    if (req.file) {
        const uploadimg = await cloudinary.uploader.upload(req.file.path);
        updateArr.attachment = uploadimg.secure_url;
    }

    if (Object.keys(updateArr).length === 0)
        return res.status(401).json({ message: "Enter at least one field" });

    try {
        const journal = await Journal.findByIdAndUpdate(req.params.id, {
            $set: updateArr
        });
        if (!journal)
            return res.status(404).json({ message: "Journal not found" });
        else {
            const updatedJournal = await Journal.findById(req.params.id);
            res.status(200).json(updatedJournal);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

// For the teacher, the teacher can delete a journal
router.delete('/delete/:id', teacherAuth, async (req, res) => {
    try {
        const journal = await Journal.findByIdAndDelete(req.params.id);
        if (!journal)
            return res.status(404).json({ message: "Journal not found" });
        else
            res.status(200).json(journal);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

export { router as teacherRouter };
