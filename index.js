const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Import JWT for token verification
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes'); // New
const stockRoutes = require('./routes/stockRoutes'); // New
const entryRoutes = require('./routes/entryRoutes'); // New
const salesRoutes = require('./routes/salesRoutes'); // New

const app = express();

app.use(express.json());
app.use(cookieParser());

// Check if it's a localhost environment
const allowedOrigins = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined
  ? ['http://localhost:3000'] // Local development
  : ['https://store-two-sigma.vercel.app']; // Production domain

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    req.user = user; // Attach user data to the request
    next();
  });
};

// Use routes (add authentication middleware as needed)
app.use('/api/users', userRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/stock', authenticateToken, stockRoutes);
app.use('/api/entry', authenticateToken, entryRoutes);
app.use('/api/sales', authenticateToken, salesRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

