const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
var connection = mongoose.createConnection(process.env.DATABASE);
autoIncrement.initialize(connection);
// User Schema Or Document Structure

const projectSchema = mongoose.Schema({
    index: {
        type: Number,
        unique: true,
        default: 0
    },
    projectName: {
        type: String,
        required: true,
        unique: true,
    },
    ngo: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: String,
        required :true
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    vol: {
        type: [String],
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    }

})
projectSchema.plugin(autoIncrement.plugin, { model: "", field: "index" });

//Create Model
const Projects = new mongoose.model("PROJECT", projectSchema);
module.exports = Projects;