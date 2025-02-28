import rateLimit from 'express-rate-limit';
import logger from '../logger.js'; // Import the logger

const failedLoginAttempts = new Map();

// Middleware to track failed login attempts
export const trackFailedLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  const attempts = failedLoginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };

  if (Date.now() - attempts.lastAttempt > 15 * 1000) {
    // Reset attempts after 15 seconds
    attempts.count = 0;
  }

  attempts.lastAttempt = Date.now();
  failedLoginAttempts.set(ip, attempts);
  next();
};

// Rate limiter for login endpoint based on failed attempts
export const loginLimiter = (req, res, next) => {
  const ip = req.ip;
  const attempts = failedLoginAttempts.get(ip) || { count: 0 };

  if (attempts.count >= 5) {
    logger.warn(`Login rate limit exceeded - IP: ${req.ip}, Path: ${req.path}`);
    return res.status(429).json({ message: 'Too many login attempts, please try again later.' });
  }

  next();
};

// Middleware to increment failed login attempts
export const incrementFailedLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  const attempts = failedLoginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };

  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  failedLoginAttempts.set(ip, attempts);
  next();
};

// Function to reset failed login attempts
export const resetFailedLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  failedLoginAttempts.delete(ip);
  next();
};

// Global rate limiter: Applies to all routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    logger.warn(`Global rate limit exceeded - IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
  },
});