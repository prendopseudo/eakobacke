const User = require('../models/userModel');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = Buffer.from('ee6c78b5cc51198cec7d3aa209ecd0705e09c9c021826dfac9df062e3764d6a0', 'hex'); // Replace with your actual key
const iv = crypto.randomBytes(16); // Ensure iv is 16 bytes

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrypted.toString();
};

const generateUniqueUserId = async () => {
  let userId;
  let userExists = true;

  while (userExists) {
    userId = crypto.randomBytes(8).toString('hex');
    const existingUser = await User.findOne({ 'userId.content': userId });
    if (!existingUser) {
      userExists = false;
    }
  }
  return userId;
};

const createNewUser = async (req, res) => {
  try {
    const userId = await generateUniqueUserId();
    const password = crypto.randomBytes(12).toString('hex');
    const credits = req.body.credits || 0;

    const encryptedUserId = encrypt(userId);
    const encryptedPassword = encrypt(password);

    const newUser = new User({
      userId: encryptedUserId,
      password: encryptedPassword,
      credits: credits
    });

    await newUser.save();

    const baseUrl = 'https://kingexch12-dd377.web.app';
    const loginLink = `${baseUrl}/?userId=${encryptedUserId.content}&password=${password}`;

    res.json({
      encryptedUserId: encryptedUserId.content,
      iv: encryptedUserId.iv,
      password,
      credits,
      loginLink
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
};

const updateUserCredits = async (req, res) => {
  try {
    const { credits } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.credits = credits;
    await user.save();

    res.json({ message: 'Credits updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating credits');
  }
};

const updateUser = async (req, res) => {
  try {
    const { updates } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).send('User not found');
    }

    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).send('User not found');
    }

    await User.deleteOne({ _id: user._id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).send('User not found');
    }

    const decryptedUserId = decrypt(user.userId);
    const decryptedPassword = decrypt(user.password);

    res.json({
      userId: decryptedUserId,
      password: decryptedPassword,
      credits: user.credits
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting user');
  }
};

const generateUserLink = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const encryptedUserId = encrypt(userId);
    const encryptedPassword = encrypt(password);

    const baseUrl = 'https://kingexch12-dd377.web.app';
    const loginLink = `${baseUrl}/?userId=${encryptedUserId.content}&password=${encryptedPassword.content}&iv=${encryptedUserId.iv}`;

    res.json({ loginLink });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating user link');
  }
};

const decryptText = (req, res) => {
  try {
    const { text, iv } = req.body;
    
    const decryptedText = decrypt({ content: text, iv });
    
    res.json({ decryptedText });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error decrypting text');
  }
};

module.exports = { createNewUser, updateUserCredits, updateUser, deleteUser, getUser, generateUserLink, decryptText };
