const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// User Schema Or Document Structure

const userSchema = mongoose.Schema({
    fullname : {
        type : String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    activeStatus:{
        type:String,
        required:true,
    },
    requestCertification:{
        type:Number,
        default:0
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
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password,10);
    }
    next();
})

//Generate Tokens to verify user
userSchema.methods.generateToken = async function(){
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
const Users = new mongoose.model("USER", userSchema);
module.exports = Users;
