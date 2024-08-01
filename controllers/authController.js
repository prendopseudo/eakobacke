const TempCredentials = require('../models/tempCredentialsModel');
const crypto = require('crypto');

// Utility function to generate a random string
const generateRandomString = (length) => crypto.randomBytes(length).toString('hex');

// Generate temporary user credentials
const generateTempCredentials = async (req, res) => {
  try {
    const userId = generateRandomString(8);
    const password = generateRandomString(12);

    const newTempCredentials = new TempCredentials({
      userId,
      password,
      createdAt: new Date()
    });
    await newTempCredentials.save();

    res.json({ userId, password });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating temporary credentials');
  }
};

// Verify temporary user credentials
const verifyTempCredentials = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log(`Received credentials: userId = ${userId}, password = ${password}`);
    const tempCredentials = await TempCredentials.findOne({ userId, password });

    if (!tempCredentials) {
      console.log('Invalid credentials or credentials have expired.');
      return res.status(401).send('Invalid credentials');
    }

    // Invalidate the credentials after use
    await TempCredentials.deleteOne({ _id: tempCredentials._id });

    res.json({ message: 'Access granted' });
  } catch (err) {
    console.error('Error verifying credentials', err);
    res.status(500).send('Error verifying credentials');
  }
};


module.exports = { generateTempCredentials, verifyTempCredentials };
