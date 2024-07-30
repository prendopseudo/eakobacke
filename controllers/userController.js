const User = require('../models/userModel');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = crypto.randomBytes(32); // Ensure this is 32 bytes long

// Utility function to generate a random string
const generateRandomString = (length) => crypto.randomBytes(length).toString('hex');

// Function to encrypt text
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

// Function to decrypt text
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrypted.toString();
};

// Function to generate a unique user ID
const generateUniqueUserId = async () => {
  let userId;
  let userExists = true;

  while (userExists) {
    userId = generateRandomString(8);
    const existingUser = await User.findOne({ 'userId.content': userId });
    if (!existingUser) {
      userExists = false;
    }
  }
  return userId;
};

// Controller function to handle new user creation
const createNewUser = async (req, res) => {
  try {
    const userId = await generateUniqueUserId();
    const password = generateRandomString(12);

    const encryptedUserId = encrypt(userId);
    const encryptedPassword = encrypt(password);

    const newUser = new User({
      userId: encryptedUserId,
      password: encryptedPassword
    });
    await newUser.save();

    res.json({ userId, password });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating new user');
  }
};

// Controller function to handle user search
const findUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const users = await User.find({});
    for (let user of users) {
      const decryptedUserId = decrypt(user.userId);
      const decryptedPassword = decrypt(user.password);
      if (decryptedUserId === userId && decryptedPassword === password) {
        return res.json({ userId: decryptedUserId, password: decryptedPassword });
      }
    }

    res.status(404).send('User not found');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error finding user');
  }
};

module.exports = { createNewUser, findUser };
