require("dotenv").config()
require("./api/data/db")
//var cors = require('cors')
const jobRoute = require("./routes");
const express = require("express")
const path = require("path")
const app = express();
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api',function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
               'Content-Type,X-Requested-With,cache-control,pragma');
    next();
})
app.use('/api',jobRoute);
const server = app.listen(process.env.PORT,function()
{
    console.log(process.env.SERVER_MSG+server.address().port);
})
