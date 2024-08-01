const mongoose = require('mongoose');

// Define TempCredentials Schema
const tempCredentialsSchema = new mongoose.Schema({
  userId: String,
  password: String,
  createdAt: {
    type: Date,
    expires: '5m', // Credentials expire after 5 minutes
    default: Date.now
  }
});

// Create TempCredentials Model
const TempCredentials = mongoose.model('TempCredentials', tempCredentialsSchema);

module.exports = TempCredentials;
