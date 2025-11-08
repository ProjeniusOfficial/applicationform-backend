// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// --- Add your Vercel URLs here when you deploy ---
const allowedOrigins = [
  'http://localhost:3000', // For local frontend testing
  'http://localhost:3001', // For local admin page testing (if you use a different port)
   'https://admin-dashboard-jet-mu-14.vercel.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions)); // Allow cross-origin requests
app.use(express.json({ limit: '10mb' })); // Allow server to accept JSON
app.use(express.urlencoded({ extended: true }));

// --- Database Connection ---
// We removed the deprecated { useNewUrlParser, useUnifiedTopology } options
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Routes ---
app.use('/api', require('./routes/applicationRoutes')); // This line is perfect

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});