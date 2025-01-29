import request from 'supertest';
import app from '../app.js';

describe('URL Shortener API', () => {
  it('should shorten a valid URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ longUrl: 'https://example.com' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('should redirect to original URL', async () => {
    const res = await request(app)
      .get('/abc123');
    
    expect(res.statusCode).toEqual(302);
  });
});