// routes/logs.js
// This file handles creating, reading, and deleting activity log entries.
// All routes here require the user to be logged in.

const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// --- Middleware to check login ---
// This function runs before any route in this file.
// If the user is not logged in, it stops the request and returns an error.
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'You must be logged in to do this' });
  }
  next(); // if logged in, continue to the actual route
}

// Apply the login check to all routes in this file
router.use(requireLogin);

// --- GET ALL LOGS ---
// GET /api/logs
// Returns all log entries for the currently logged-in user
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch logs' });
  }
});

// --- CREATE A LOG ---
// POST /api/logs
// Saves a new activity log entry for the logged-in user
router.post('/', async (req, res) => {
  try {
    const { name, category, co2, emoji, date } = req.body;

    // Basic validation
    if (!name || !category || co2 === undefined || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const log = new Log({
      userId: req.session.userId,
      name,
      category,
      co2: parseFloat(co2),
      emoji: emoji || '📋',
      date
    });

    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save log' });
  }
});

// --- DELETE A LOG ---
// DELETE /api/logs/:id
// Deletes a specific log entry - only if it belongs to the logged-in user
router.delete('/:id', async (req, res) => {
  try {
    // We check userId so users cannot delete each other's entries
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json({ message: 'Log deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete log' });
  }
});

module.exports = router;
