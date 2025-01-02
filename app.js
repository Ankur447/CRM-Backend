const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Combined routes
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');

require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
// Catch-all route to serve index.html for all non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
// Use combined user routes

app.use('/api/users', userRoutes);
app.use(errorHandler);
module.exports = app;
