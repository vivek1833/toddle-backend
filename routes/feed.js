import express from 'express';
import env from 'dotenv';
env.config();

import { Journal } from '../models/journal.js';
import { User } from '../models/user.js';
import { teacherAuth } from '../middleware/teacherauth.js';
import { studentAuth } from '../middleware/studentauth.js';

const router = express.Router();

// For the teacher, the feed will return all the journals created by the Teacher
router.get('/teacher', teacherAuth, async (req, res) => {
    try {
        const journals = await Journal.find({ teacher: req.id });
        res.status(200).json({ total: journals.length, journals: journals });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// For students, the feed will return all the journals the student has been tagged.
router.get('/student', studentAuth, async (req, res) => {
    try {
        const user = await User.findById(req.id);
        const journals = await Journal.find();
        const filteredJournals = [];
        
        journals.forEach(journal => {
            if (journal.students[0].includes(user.username))
                filteredJournals.push(journal);
        });

        res.status(200).json({ total: filteredJournals.length, journals: filteredJournals });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

export { router as feedRouter };
