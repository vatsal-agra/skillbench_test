import { Request, Response, NextFunction } from 'express';

// In a real app, store this in environment variables
const API_KEYS = new Set([process.env.API_KEY || 'test_key_123']);

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  if (!API_KEYS.has(apiKey as string)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
};
