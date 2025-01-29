import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  hits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiration
});

export default mongoose.model('Url', urlSchema);