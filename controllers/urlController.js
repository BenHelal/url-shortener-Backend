import Url from '../models/Url.js';
import { generateShortId } from '../utils/helpers.js';
import validator from 'validator';
import { redis } from '../server.js'; // Ensure redis is imported properly

// POST /shorten (Shorten URL)
export const shortenUrl = async (req, res) => {
    const { longUrl } = req.body;

    if (!validator.isURL(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        let shortId;
        do {
            shortId = generateShortId(7);
        } while (await Url.exists({ shortId }));

        const url = await Url.create({ shortId, originalUrl: longUrl });
        const shortUrl = `${process.env.BASE_URL}/${shortId}`;

        res.status(201).json({ shortUrl });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /analytics/:shortId (Fetch analytics)
export const getAnalytics = async (req, res) => {
    try {
        const url = await Url.findOne({ shortId: req.params.shortId })
            .select('hits createdAt expiresAt')
            .lean();

        if (!url) return res.status(404).json({ error: 'URL not found' });

        res.json({
            hits: url.hits,
            created_at: url.createdAt,
            expires_at: url.expiresAt,
            days_remaining: Math.ceil((url.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)),
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /:shortId (Redirect to original URL)
export const redirectUrl = async (req, res) => {
    const { shortId } = req.params;

    try {
        // Check cache first
        const cachedUrl = await redis.get(shortId);
        if (cachedUrl) {
            await Url.findOneAndUpdate({ shortId }, { $inc: { hits: 1 } });
            return res.redirect(cachedUrl);
        }

        // Database lookup
        const url = await Url.findOneAndUpdate({ shortId }, { $inc: { hits: 1 } });

        if (!url) return res.status(404).json({ error: 'URL not found' });

        // Cache with 1-hour expiration
        await redis.set(shortId, url.originalUrl, { EX: 3600 });

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /stats/:shortId (Fetch URL stats)
export const getUrlStats = async (req, res) => {
    try {
        const url = await Url.findOne({ shortId: req.params.shortId });

        if (!url) return res.status(404).json({ error: 'URL not found' });

        res.json({
            hits: url.hits,
            createdAt: url.createdAt,
            originalUrl: url.originalUrl,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
