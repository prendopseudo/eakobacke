const crypto = require('crypto');
const User = require('../models/userModel');

const algorithm = 'aes-256-ctr';
const secretKey = Buffer.from('ee6c78b5cc51198cec7d3aa209ecd0705e09c9c021826dfac9df062e3764d6a0', 'hex');

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrypted.toString();
};

const userExists = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [iv, content] = userId.split('.');

    const decryptedUserId = decrypt({ iv, content });
    console.log('Decrypted User ID:', decryptedUserId);

    const user = await User.findOne({ 'userId.content': content });

    if (!user) {
      return res.status(404).send('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error checking user existence', err);
    res.status(500).send('Error checking user existence');
  }
};


module.exports = { userExists };