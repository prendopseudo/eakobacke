const mongoose = require('mongoose');

const tempCredentialsSchema = new mongoose.Schema({
  userId: String,
  password: String,
  createdAt: {
    type: Date,
    expires: '5m', // Credentials expire after 5 minutes
    default: Date.now
  }
});

const TempCredentials = mongoose.model('TempCredentials', tempCredentialsSchema);

module.exports = TempCredentials;
