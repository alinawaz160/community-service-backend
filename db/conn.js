const mongoose = require('mongoose');
const db = process.env.DATABASE;

mongoose.set("strictQuery", false);
mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log("Connection Successful")
})