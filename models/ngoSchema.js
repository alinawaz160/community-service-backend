const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// User Schema Or Document Structure

const ngoSchema = mongoose.Schema({
    ngoName : {
        type : String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    branches:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    activeStatus:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})
//Hashing password to Secure
ngoSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password,10);
    }
    next();
})

//Generate Tokens to verify user
ngoSchema.methods.generateToken = async function(){
    try{
    let generatedToken = jwt.sign({_id : this.id} , process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token : generatedToken});
    await this.save();
    return generatedToken;
    }
    catch(error){
        console.log(error);
    }
}

//Create Model
const Ngos = new mongoose.model("NGO", ngoSchema);
module.exports = Ngos;
