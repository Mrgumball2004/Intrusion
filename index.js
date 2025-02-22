const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // MySQL host
  user: 'root',      // MySQL username
  password: 'your_root_password', // MySQL password (set during installation)
  database: 'user_auth',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error signing up:', err);
      return res.status(500).json({ message: 'Sign-up failed' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ message: 'Login failed' });
    }

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
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});