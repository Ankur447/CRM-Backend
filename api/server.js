const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('../Config');
const cron = require('node-cron');
const port = 3000;
const bodyParser = require("body-parser");
const route = require('../Routes/Routes');
const authMiddleware = require('../Middleware/authMiddleware');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());
//Test route
app.get('/getout', (req, res) => {
  return res.status(200).json({ message: "Hello from Express.js!" });
});

app.use(authMiddleware)
app.use('/api/',route);






// Apply 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found.");
});
// Start the server
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
// Cron jobs
require('../cron');

module.exports = app;