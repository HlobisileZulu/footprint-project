// models/Log.js
// This file defines what an activity log entry looks like in the database.
// Each log entry is linked to a specific user.

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  // This links the log to a specific user in the User collection
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true  // the name of the activity e.g. "Car trip"
  },
  category: {
    type: String,
    required: true,
    enum: ['transport', 'food', 'energy', 'goods']  // only these values are allowed
  },
  co2: {
    type: Number,
    required: true  // the CO2 value in kg
  },
  emoji: {
    type: String,
    default: '📋'
  },
  date: {
    type: String,  // stored as YYYY-MM-DD string e.g. "2024-01-15"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
