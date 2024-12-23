const express = require('express');
const cors = require('cors')
const connection = require('./Config');
const middleware = require('./Middleware/authMiddleware')
const cron = require('node-cron');
const port = 3000;

const route = require('./Routes/Routes')
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
// app.use(middleware)

app.listen(port,()=>{
    console.log(`server started on ${port}`)
})

app.use('/api/',route);
require('./cron');
// require('./Models/Slot')
module.exports=app
