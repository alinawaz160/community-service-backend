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

//using methods to get Data and cookies from Frontend
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
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username: username,
            email: email,
            password: password
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

//Run Server
app.listen(3001, () => {
    console.log("Server is listening")
})