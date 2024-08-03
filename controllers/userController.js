const User = require('../models/userModel');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

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
    const loginLink = `${baseUrl}/?userId=${userId}&password=${password}`;

    res.json({ userId, password, credits, loginLink });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
};

const updateUserCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const encryptedUserId = encrypt(userId);

    const user = await User.findOne({ 'userId.content': encryptedUserId.content });

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
    const { userId, updates } = req.body;
    const encryptedUserId = encrypt(userId);

    const user = await User.findOneAndUpdate({ 'userId.content': encryptedUserId.content }, updates, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const encryptedUserId = encrypt(userId);

    const user = await User.findOneAndDelete({ 'userId.content': encryptedUserId.content });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const encryptedUserId = encrypt(userId);

    const user = await User.findOne({ 'userId.content': encryptedUserId.content });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const decryptedUserId = decrypt(user.userId);
    const decryptedPassword = decrypt(user.password);

    res.json({ userId: decryptedUserId, password: decryptedPassword, credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting user');
  }
};

module.exports = { createNewUser, updateUserCredits, updateUser, deleteUser, getUser };
