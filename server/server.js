const express= require('express');
const cors = require('cors');
const {urlencoded} =require('express');
const mongoose =require('mongoose');
const controllers = require("./index");

//Configure file
require('dotenv').config({path:"./config.env"});

//Create server 
const app = express();
const port = process.env.PORT || 5000;

//Required Middlewares
//cors is used for cross origin resource sharing
app.use(urlencoded({extended : true}));
app.use(cors());
app.use(express.json());


//Redirecting to specific routes depending on request
app.get('/',controllers.getAllSymbols);
app.post('/',controllers.setSymbol);
app.delete('/:Id',controllers.deleteSymbol);


//Connect to MongoDB database
mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    console.log("Database Connection Established");
}).catch((err)=>{
    console.log(err);
})


//Starting Server
app.listen(port, ()=>{
    console.log(`APP is listening on port ${port}`);
})