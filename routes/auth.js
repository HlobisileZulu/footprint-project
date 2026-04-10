// routes/auth.js
// This file handles everything related to user accounts:
// registering, logging in, logging out, and checking who is logged in.

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- REGISTER ---
// POST /api/auth/register
// This runs when someone submits the registration form
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation - make sure all fields are filled in
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create and save the new user (password gets hashed automatically by our User model)
    const user = new User({ name, email, password });
    await user.save();

    // Save the user's id in the session so they stay logged in
    req.session.userId = user._id;

    res.status(201).json({ message: 'Account created', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// --- LOGIN ---
// POST /api/auth/login
// This runs when someone submits the login form
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Save user id in session
    req.session.userId = user._id;

    res.json({ message: 'Logged in', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// --- LOGOUT ---
// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// --- GET CURRENT USER ---
// GET /api/auth/me
// The frontend calls this when the page loads to check if someone is already logged in
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not logged in' });
    }
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not logged in' });
    }
    res.json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
