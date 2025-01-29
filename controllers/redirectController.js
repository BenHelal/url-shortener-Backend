import redis from '../config/redis';
import Url from '../models/Url'; // Assuming you have a URL model

export const redirectUrl = async (req, res) => {
  const { shortId } = req.params;

  try {
    // Check cache first
    const cachedUrl = await redis.get(shortId);
    if (cachedUrl) {
      await Url.findOneAndUpdate(
        { shortId },
        { $inc: { hits: 1 } }
      );
      return res.redirect(cachedUrl);
    }

    // Database lookup
    const url = await Url.findOneAndUpdate(
      { shortId },
      { $inc: { hits: 1 } }
    );

    if (!url) return res.status(404).json({ error: 'URL not found' });

    // Cache with 1-hour expiration
    await redis.set(shortId, url.originalUrl, 'EX', 3600);
    
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};