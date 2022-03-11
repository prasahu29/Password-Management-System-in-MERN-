const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project');
var con=mongoose.connection;

const userSchema=new mongoose.Schema({
    name:String,
    image:String

});

var userModel = mongoose.model('Category',userSchema);   

module.exports = userModel;