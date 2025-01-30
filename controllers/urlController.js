import Url from '../models/Url.js';
import { generateShortId } from '../utils/helpers.js';
import validator from 'validator';

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

export const redirectUrl = async (req, res) => {
    const { shortId } = req.params;
  
  try {
    const url = await Url.findOneAndUpdate(
      { shortId },
      { $inc: { hits: 1 } },
      { new: true }
    );
    
    if (!url) return res.status(404).json({ error: 'URL not found' });
    
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json({
      hits: url.hits,
      createdAt: url.createdAt,
      originalUrl: url.originalUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};