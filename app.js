const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Combined routes
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route should be LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use('/api/users', userRoutes);
app.use(errorHandler);
module.exports = app;
