require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const invitesRouter = require('./routes/invites.routes');
const rsvpRouter = require('./routes/rsvp.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Add this helper function
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];

// Update CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      console.log('Allowed origins:', corsOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

// Add debug logging
console.log('Allowed CORS origins:', corsOrigins);

// Move routes before error handler
app.get('/', (req, res) => {
  res.send('Ciao World');
});
app.use('/api/invites', invitesRouter);
app.use('/api/rsvps', rsvpRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

