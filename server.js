require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const invitesRouter = require('./routes/invites.routes');
const rsvpRouter = require('./routes/rsvp.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

// Move routes before error handler
app.get('/', (req, res) => {
  res.send('Ciao World');
});
app.use('/api/invites', invitesRouter);
app.use('/api/rsvps', rsvpRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
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

