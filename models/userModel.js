const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  userId: {
    iv: String,
    content: String
  },
  password: {
    iv: String,
    content: String
  }
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
