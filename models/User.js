// models/User.js
// This file defines what a User looks like in our database.
// Think of it as a blueprint for storing user information.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true  // removes extra spaces from start and end
  },
  email: {
    type: String,
    required: true,
    unique: true,  // no two users can have the same email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Before saving a user, we hash (scramble) their password so it is not stored as plain text.
// This runs automatically every time we save a user.
userSchema.pre('save', async function (next) {
  // Only hash if the password was changed (to avoid double-hashing)
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// A helper method to check if a typed password matches the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
