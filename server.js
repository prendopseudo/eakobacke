const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  createNewUser,
  updateUserCredits,
  updateUser,
  deleteUser,
  getUser
} = require('./controllers/userController');
const { generateTempCredentials, verifyTempCredentials } = require('./controllers/authController');

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
app.put('/updateCredits', updateUserCredits);
app.put('/updateUser', updateUser);
app.delete('/deleteUser', deleteUser);
app.get('/getUser/:userId', getUser);
app.post('/generateTempCredentials', generateTempCredentials);
app.post('/verifyTempCredentials', verifyTempCredentials);

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
