const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');

// routes
const authRoute = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
const postRoutes = require('./routes/postRoute');

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/users', authRoute);
app.use('/api/products', productRoutes);
app.use('/api/posts', postRoutes);

// error handlers
app.use(notFound);
app.use(errorHandler);

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
