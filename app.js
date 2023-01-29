const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser= require('cookie-parser');

const app = express();

// Configuration ENV File and Require Connection File
dotenv.config({path:"./config.env"});
require("./db/conn")
app.get('/', (req , res)=>{
    res.send("Hello World")
});

//Run Server
app.listen(3001,()=>{
    console.log("Server is listening")
} )