const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Make sure to import your User model

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Fetch user by mobile number
    const user = await User.findOne({ mobile });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Access denied' });
    }
    
    return res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
