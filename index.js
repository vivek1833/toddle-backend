import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import {authRouter} from './routes/auth.js';
import {teacherRouter} from './routes/teacher.js';
import {feedRouter} from './routes/feed.js';

const app = express();
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT;
const CONN = process.env.DataBase;

mongoose.set('strictQuery', false); 
mongoose.connect(CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected");
}).catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.status(200).json('Toddle backend working');
});

app.use('/auth', authRouter);
app.use('/teacher', teacherRouter);
app.use('/feed', feedRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});