## API Endpoints

`POST /shorten`
- Request body: { "longUrl": "https://example.com" }
- Response: { "shortUrl": "https://your-domain.com/abc123" }

`GET /:shortId`
- Redirects to original URL

## Setup
1. Clone repo
2. Install dependencies: `npm install`
3. Start backend: `npm run dev`
4. Start frontend: `cd client && npm run dev`


## Advanced Features

- **Rate Limiting**: 100 requests/15 minutes for URL shortening
- **Caching**: Frequently accessed URLs stored in Redis for 1 hour
- **Auto-Expiration**: URLs automatically deleted after 30 days
- **Analytics**: Check usage stats at `GET /analytics/:shortId`

## Environment Variables

| Variable              | Description                     |
|-----------------------|---------------------------------|
| REDIS_URL             | Redis connection string         |
| RATE_LIMIT_WINDOW     | Rate limit window in minutes    |
| RATE_LIMIT_MAX        | Max requests per IP per window  |