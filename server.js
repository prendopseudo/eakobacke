const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import controllers
const {
  createNewUser,
  updateUserCredits,
  updateUser,
  deleteUser,
  getUser,
  generateUserLink,
  decryptText
} = require('./controllers/userController');
const { generateTempCredentials, verifyTempCredentials } = require('./controllers/authController');
const { userExists } = require('./controllers/middleware'); // Import the middleware

const app = express();
const port = 3000;
const db = "mongodb+srv://kingexch12:kuRGCt61YEvirdkM@kingexch.tymuioq.mongodb.net/kingexch?retryWrites=true&w=majority&appName=Kingexch";

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log("Setup Initialized"))
  .catch((err) => console.error("Connection went wrong!", err));

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to KingExch12.com server. Type your URLs");
});

app.post('/newUser', createNewUser);
app.put('/updateCredits', userExists, updateUserCredits);
app.put('/updateUser', userExists, updateUser);
app.delete('/deleteUser', userExists, deleteUser);
app.get('/getUser/:userId', userExists, getUser);
app.post('/generateUserLink', generateUserLink);
app.post('/generateTempCredentials', generateTempCredentials);
app.post('/verifyTempCredentials', verifyTempCredentials);
app.post('/decryptText', decryptText); // New endpoint

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
