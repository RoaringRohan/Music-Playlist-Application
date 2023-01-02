require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
const port = 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true, 
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
  }
}

connectDB();

app.use('/api/login', require('./routes/login'));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});