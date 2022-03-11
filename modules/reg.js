const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project');
var con=mongoose.connection;


// SCHEMA 

const regSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
});


// createing model 

var regModel = mongoose.model('projectform',regSchema);   

module.exports = regModel;











