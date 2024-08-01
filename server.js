const express = require('express');
const mongoose = require('mongoose');
const { createNewUser, findUser } = require('./controllers/userController');
const { generateTempCredentials, verifyTempCredentials } = require('./controllers/authController');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const db = "mongodb+srv://kingexch12:kuRGCt61YEvirdkM@kingexch.tymuioq.mongodb.net/kingexch?retryWrites=true&w=majority&appName=Kingexch";

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log("Setup Initialized"))
  .catch((err) => console.error("Connection went wrong!", err));

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to KingExch12.com server. Type your URLs");
});

app.get('/newUser', createNewUser);
app.post('/findUser', findUser);
app.post('/generateTempCredentials', generateTempCredentials);
app.post('/verifyTempCredentials', verifyTempCredentials);

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
