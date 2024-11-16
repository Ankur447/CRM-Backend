const express = require('express');
const cors = require('cors')
const connection = require('./Config');
const middleware = require('./Middleware/authMiddleware')
const port = 3000;

const route = require('./Routes/Routes')
const app = express();
app.use(cors());
app.use(express.json());
//app.use(middleware)

app.listen(port,()=>{
    console.log(`server started on ${port}`)
})

app.use('/api/',route);


module.exports=app


