const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env variable for JWT secret

// Middleware to authenticate using JWT
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login route
router.post('/login', [
  body('mobile').isString().withMessage('Mobile must be a string'),
  body('password').isString().withMessage('Password must be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { mobile, password } = req.body;

    // Fetch user by mobile number
    const user = await User.findOne({ mobile });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10h' });
    
    // Set token in HTTP-only cookie (optional; you can send it directly instead)
    res.cookie('token', token, { httpOnly: true, secure: true }); // Secure cookie if HTTPS

    // Send token in response
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Protected route to fetch user data based on token
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user data', error });
  }
});

// PUT route to update user data
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const updatedData = { mobile };
    if (password) {
      updatedData.password = password; // Update password directly
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ message: 'Failed to update user', error });
  }
});

module.exports = router;
