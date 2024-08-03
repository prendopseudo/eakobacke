const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    iv: String,
    content: String
  },
  password: {
    iv: String,
    content: String
  },
  credits: Number  // New field for storing user credits
});

const User = mongoose.model('User', userSchema);

module.exports = User;
