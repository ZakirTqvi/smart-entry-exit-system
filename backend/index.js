import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import entryRoutes from './routes/entryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import faceRoutes from './routes/faceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import entrylogRoutes from './routes/entrylogRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import occupancyRoutes from './routes/occupancyRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', entryRoutes);
app.use('/api', authRoutes);
app.use('/api', faceRoutes);
app.use('/api', userRoutes);
app.use('/api', entrylogRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', occupancyRoutes);
app.use('/api', visitorRoutes);
app.use('/api', reportRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});