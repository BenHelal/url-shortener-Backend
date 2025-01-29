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