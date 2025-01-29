import Url from '../models/Url'; // Assuming you have a URL model

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
      days_remaining: Math.ceil(
        (url.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
