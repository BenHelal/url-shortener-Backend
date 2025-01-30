import express from 'express';
import mongoose from 'mongoose';
import Redis from 'redis';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Trust proxy (fix X-Forwarded-For issue)
app.set('trust proxy', 1);

// Configure Redis

const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 10776
    }
});


// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});



// Database connection
connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => {
      return req.ip; // Use client IP even behind proxy
    },
    handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

// Routes
app.use('/api', apiLimiter);
app.use('/api', urlRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
  });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

export { app, redis };