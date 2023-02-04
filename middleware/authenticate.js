const Users = require("../models/userSchema");
const jwt = require("jsonwebtoken")
const authenticate = async (req,res)=>{
    try {
        const token =req.body.jwt;
        if(!token){
            res.status(401).send("No tokens");
        }
        else{
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await Users.findOne({_id :verifyToken._id, "tokens.token":token})

            if(!rootUser){
                res.status(401).send("User not Found");
            }
            else{
                res.status(200).send("Authorized User");
            }
        }
        next(); 
    } catch (error) {
        res.status(401).send("error");
        console.log(error)
    }
}

module.exports =authenticate;