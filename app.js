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
const authenticate  =require("./middleware/authenticate");
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
            address: address,
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
        const user = await Users.findOne({ email: email });
        if (user) {
            //Verify password
            const isMatch = await bcryptjs.compare(password, user.password);

            if (isMatch) {
                const token = await user.generateToken();
                console.log(token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                })
                res.status(200).send("LoggedIn");
                console.log("LoggedIn");
            } else {
                res.status(400).send("Invalid Credentials")
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
const multer = require("multer");
const { default: mongoose } = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/createProject", upload.single("image"), async (req, res) => {
    try {
        const projectName = req.body.projectName;
        const ngo = req.body.ngo;
        const uploadDate = req.body.uploadDate;
        const description = req.body.description;
        const isActive = req.body.isActive;
        
        console.log("uploadDate",uploadDate)
        const image = req.file.buffer;

        const createproject = new Projects({
            projectName: projectName,
            ngo: ngo,
            uploadDate: new Date(uploadDate),
            description: description,
            isActive: isActive,
            image: image
        });
        //Saving the created project...
        const created = await createproject.save();
        console.log(created);
        res.status(200).send("Created");
    } catch (error) {
        console.log(error);
    }
});


//Get Projects
app.get("/getProjects", async (req, res) => {
    try {
        const projects = await Projects.find({});
        if (projects.length > 0) {
            res.status(200).send(projects);
            console.log("Data Retrived")
        }
        else {
            res.status(204).send("No Data found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete Projects
app.delete("/deleteProject/:id", async (req, res) => {

    const id = req.params.id;
    const projectId = mongoose.Types.ObjectId(id);
    try {
        const project = await Projects.findByIdAndDelete(projectId);
        if (project) {
            res.status(200).send("Project deleted successfully");
        } else {
            res.status(404).send("Project not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Get Volunteers
app.get("/getVolunteers", async (req, res) => {
    try {
        const volunteers = await Users.find({});
        if (volunteers.length > 0) {
            res.status(200).send(volunteers);
            console.log("Volunteers Found")
        }
        else {
            res.status(204).send("No Data found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete Volunteer
app.delete("/deleteVolunteer/:id", async (req, res) => {
    const id = req.params.id;
    const volunteerId = mongoose.Types.ObjectId(id);
    try {
        const volunteer = await Users.findOneAndDelete({ _id: volunteerId });
        if (volunteer) {
            res.status(200).send("Volunteer deleted successfully");
        } else {
            res.status(404).send("Volunteer not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Update Volunteer
app.put("/updateVolunteer/:id", async (req, res) => {
    try {
    const volunteer = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (volunteer) {
    res.status(200).send(volunteer);
    console.log("Volunteer Updated")
    } else {
    res.status(404).send("Volunteer Not Found");
    }
    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    }
    });


//Get Ngo
app.get("/getNGO", async (req, res) => {
    try {
        const volunteers = await Users.find({});
        if (volunteers.length > 0) {
            res.status(200).send(volunteers);
            console.log("Volunteers Found")
        }
        else {
            res.status(204).send("No Data found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
//update NGO
app.put("/updateNGO/:id", async (req, res) => {
    try {
    const volunteer = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (volunteer) {
    res.status(200).send(volunteer);
    console.log("Volunteer Updated")
    } else {
    res.status(404).send("Volunteer Not Found");
    }
    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    }
    });

//Authentication
app.get('/auth' ,authenticate,async (req,res)=>{
    
})
//Logout Page
app.get('/logout', (req, res) => {
    res.clearCookie("jwt", { path: '/' })
    res.status(200).send("User Logged Out");
})
//Run Server
app.listen(3001, () => {
    console.log("Server is listening")
})