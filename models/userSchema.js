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
        type:String,
        required:true,
        unique:true
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
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password,10);
    }
    next();
})

//Generate Tokens to verify user
userSchema.methods.generateToken = async function(){
    try{
    let generatedToken = jwt.sign({_id : this.id} , youcanchooseanysecretkeyofcharacters);
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
