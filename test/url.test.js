import request from 'supertest';
import app from '../app.js';
import Url from '../models/Url.js';
import redis from '../config/redis.js';

describe('URL Shortener API', () => {
  beforeAll(async () => {
    // Create a test URL entry
    await Url.create({
      shortId: 'abc123',
      originalUrl: 'https://example.com',
    });
  });

  afterAll(async () => {
    // Cleanup database and Redis
    await Url.deleteMany();
    await redis.flushall();
    redis.disconnect();
  });

  describe('Redirection', () => {
    it('should redirect to original URL', async () => {
      const res = await request(app).get('/abc123');
      expect(res.statusCode).toBe(302);
      expect(res.header.location).toBe('https://example.com');
    });

    it('should use cached URLs for faster response', async () => {
      // First request (populate cache)
      await request(app).get('/abc123');
      
      // Second request (should use cache)
      const start = Date.now();
      await request(app).get('/abc123');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Cached response should be <100ms
    });
  });


  beforeEach(async () => {
    await redis.flushall();
  });

  expect(duration).toBeLessThan(150); // Give 50ms buffer for CI/CD environments

  jest.mock('../config/redis.js', () => ({
    get: jest.fn(),
    set: jest.fn(),
    flushall: jest.fn(),
    disconnect: jest.fn(),
  }));
});