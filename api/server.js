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




// const express = require('express');
// const app = express();
// const cors = require('cors')
// const connection = require('./Config');
// const { webhookRouter } = require("./Models/Payment");


// const cron = require('node-cron');
// const port = 3000;
// const bodyParser = require("body-parser");
// const route = require('./Routes/Routes');
// const authMiddleware = require('./Middleware/authMiddleware');

// app.use(cors({ origin: '*' }));

// app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
//     res.send();
// });

// app.use(express.json());
// app.use(bodyParser.json());
// app.get('/getout',(req,res)=>{
//     return res.status(200).json({message:"oh hell naw"})
// })
// app.post("/webhook/cashfree", (req, res) => {
//   const CASHFREE_SECRET = process.env.CASHFREE_SECRET; // Environment variable for the secret key
//   const signature = req.headers["x-webhook-signature"];
//   const payload = JSON.stringify(req.body);

//   // Validate the signature
//   const hmac = crypto.createHmac("sha256", CASHFREE_SECRET).update(payload).digest("base64");
//   if (signature !== hmac) {
//     return res.status(400).send("Invalid signature");
//   }

//   // Process the webhook payload
//   console.log("Webhook payload received:", req.body);

//   res.status(200).send("Webhook received");
// });

// app.use(authMiddleware);
// app.use(webhookRouter);

// // Apply routes first
// app.use('/api/', route);




// app.listen(port, () => {
//     console.log(`server started on ${port}`);
// });

// require('./cron');


// module.exports=app

