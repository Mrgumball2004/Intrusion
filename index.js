import express from 'express';
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await support
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// MySQL connection
const db = mysql.createPool({
  host: 'localhost', // MySQL host
  user: 'root',      // MySQL username
  password: '', // MySQL password (set during installation)
  database: 'user_auth',
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [result] = await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    // Return success message and user data
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.insertId, email: email }, // Include user data in the response
    });
  } catch (err) {
    console.error('Error signing up:', err);
    res.status(500).json({ message: 'Sign-up failed' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return success (in a real app, you'd return a JWT token)
    res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});