const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
// Admin Schema Or Document Structure

const adminSchema = mongoose.Schema({
    email : {
        type : String,
        default:"Admin"
    },
    password:{
        type:String,
        default:"Complicated"
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});
adminSchema.methods.generateToken = async function(){
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
const Admin = new mongoose.model("ADMIN", adminSchema);
module.exports = Admin;