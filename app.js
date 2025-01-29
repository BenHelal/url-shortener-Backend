import express from 'express';
import rateLimit from 'express-rate-limit';
import { redirectUrl } from './controllers/redirectController';
import { getAnalytics } from './controllers/analyticsController';
import logger from './config/logger';

const app = express();

// Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

app.use('/shorten', apiLimiter); // Apply rate limiting on the shorten route

// Routes
app.get('/:shortId', redirectUrl);
app.get('/analytics/:shortId', getAnalytics);

app.listen(3000, () => {
  logger.info('Server running on port 3000');
});