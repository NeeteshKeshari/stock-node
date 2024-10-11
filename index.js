const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes'); // New
const stockRoutes = require('./routes/stockRoutes'); // New
const salesRoutes = require('./routes/salesRoutes'); // New

const app = express();

app.use(express.json());

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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes); // New
app.use('/api/stock', stockRoutes); // New
app.use('/api/sales', salesRoutes); // New

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
