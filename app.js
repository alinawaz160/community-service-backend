const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// Configuration ENV File and Require Connection File
dotenv.config({ path: "./config.env" });
require("./db/conn");

const port = process.env.PORT || 3000;

//Require Model
const Users = require("./models/userSchema");
const Projects = require('./models/projectSchema');

//using methods to get req and cookies from Frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World")
});

//Registration
app.post('/register', async (req, res) => {
    try {
        // Get body
        const fullname = req.body.fullname;
        const email = req.body.email;
        const phone = req.body.phone;
        const address = req.body.address;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        const createUser = new Users({
            fullname: fullname,
            email: email,
            password: password,
            phone: phone,
            address: address
        });
        //Saving the created user...
        const created = await createUser.save();
        console.log(created);
        res.status(200).send("Registered");
    }
    catch (error) {
        res.status(400).send(error);
    }
})

//Login User
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        //Find User if exist
        const user = await Users.findOne({ email: email});
        if (user) {
            //Verify password
            const isMatch = await bcryptjs.compare(password, user.password);

            if (isMatch) {
                const token = await user.generteToken();
                console.log(token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                })
                res.status(200).send("LoggedIn");
                console.log("LoggedIn"); 
            } else {
                res.status(400).send("Invali Credentials")
            }
        } else {
            res.status(400).send("Invalid Credentials");
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//Projects
//Create Project
app.post('/createProject' , async(req,res)=>{
    try {
        const projectName =  req.projectName;
        const ngo = req.ngo;
        const uploadDate = req.uploadDate;
        const description = req.description;
        const isActive = req.isActive;
        const image = imageFile;

        const createproject = new Projects({
             projectName :  projectName,
             ngo : ngo,
             uploadDate : uploadDate,
             description : description,
             isActive : isActive,
             image : image
        });
        //Saving the created project...
        const created = await createproject.save();
        console.log(created);
        res.status(200).send("Created");

    } catch (error) {
        console.log(error);
    }
})

//Run Server
app.listen(3001, () => {
    console.log("Server is listening")
})