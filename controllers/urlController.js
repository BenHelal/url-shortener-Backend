import Url from '../models/Url.js';
import { generateShortId } from '../utils/helpers.js';
import validator from 'validator';

export const shortenUrl = async (req, res) => {
  // ... (as in original code)
};

export const redirectUrl = async (req, res) => {
  // ... (as in original code)
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