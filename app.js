const express = require('express');
const app = express();
const cors = require('cors')
const connection = require('./Config');
const { webhookRouter } = require("./Models/Payment");


const cron = require('node-cron');
const port = 3000;
const bodyParser = require("body-parser");
const route = require('./Routes/Routes');
const authMiddleware = require('./Middleware/authMiddleware');

app.use(cors({ origin: '*' }));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.send();
});

app.use(express.json());
app.use(bodyParser.json());
app.get("/getout",(req,res)=>{
    return res.status(200).json({message:"oh hell naw"})
})
app.use(authMiddleware);
app.use(webhookRouter);

// Apply routes first
app.use('/api/', route);

// Apply authMiddleware AFTER routes


app.listen(port, () => {
    console.log(`server started on ${port}`);
});

require('./cron');


module.exports=app
