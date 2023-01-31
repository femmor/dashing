const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5001;

const startApp = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log('Error starting the server', error);
  }
};

startApp();
