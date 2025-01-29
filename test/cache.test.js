import request from 'supertest';
import app from '../app'; // Assuming your app is exported from the main file

it('should use cached URLs for faster response', async () => {
  // First request (populate cache)
  await request(app).get('/abc123');
  
  // Second request (should use cache)
  const start = Date.now();
  await request(app).get('/abc123');
  const duration = Date.now() - start;

  expect(duration).toBeLessThan(100); // Cached response should be <100ms
});
