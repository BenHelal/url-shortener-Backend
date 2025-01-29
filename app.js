import express from 'express';
import connectDB from './config/db.js';
import urlRoutes from './routes/urlRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/', urlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));