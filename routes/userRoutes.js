const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const validMobile = '9919057758';
    const validPassword = 'Gold@99190';

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    if (mobile === validMobile && password === validPassword) {
      return res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
    } else {
      return res.status(401).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
