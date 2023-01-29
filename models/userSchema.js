const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// User Schema Or Document Structure

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required: true,
        unique : true
    },
    email:{
        typ
    }
})