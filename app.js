const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Combined routes
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
// Use combined user routes

app.use('/api/users', userRoutes);
app.use(errorHandler);
module.exports = app;
