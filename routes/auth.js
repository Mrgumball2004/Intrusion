import express from 'express';
import { trackFailedLoginAttempts, loginLimiter, incrementFailedLoginAttempts, resetFailedLoginAttempts } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/login', trackFailedLoginAttempts, loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  // ...existing login logic...

  if (loginFailed) {
    incrementFailedLoginAttempts(req, res, () => {});
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Reset failed login attempts upon successful login
  resetFailedLoginAttempts(req, res, () => {});

  // ...existing login success logic...
});

router.post('/signup', async (req, res) => {
  // ...existing signup logic...
});

export default router;
