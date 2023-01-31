const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');

// routes
const authRoute = require('./routes/userRoute');

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', authRoute);

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
