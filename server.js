// server.js
// This is the main entry point for our application.
// It sets up the Express server, connects to MongoDB,
// and loads all our routes.

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// --- Middleware ---
// This tells Express to understand JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This serves our CSS, JS and other static files from the "public" folder
app.use(express.static('public'));

// This sets up sessions so we can remember who is logged in
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // session lasts 1 day
}));

// --- Routes ---
// We load our route files and tell Express to use them
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');

app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// --- Serve the main HTML page ---
// For any other route, just send the main index.html file
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start the server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
