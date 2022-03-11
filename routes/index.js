var express = require('express');
var router = express.Router();
var regModel = require('../modules/reg')
var userModel = require('../modules/user')
var addModel = require('../modules/add')
const bcrypt = require('bcrypt');
const multer  = require('multer') //image code
var path = require('path')  //image code
router.use(express.static(__dirname+"./public/"));  //image code
var jwt = require('jsonwebtoken');  //json web token

//local storage 
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



/*middleware email check */
function checkemail(req,res,next){
  var e = req.body.email;
  var checkemail = regModel.findOne({email:e});

  checkemail.exec((err , data )=>{
    if(err) throw err;
    if(data){
      return res.render('form' , {title:'express',msg:'email aleardy exits'})
    }
    next();
  })
}


// middleware username check 
function checkusername(req,res,next){
  var u = req.body.username;
  var checkusername = regModel.findOne({username:u});
  checkusername.exec((err , data)=>{
    if (err) throw err;
    if (data) {
      return res.render('index',{title:'express', msg:'This User  Alredy Exist'})
    }
        next();
  })
}


// check login MIDDLE WARE
function CheckLoginUser(req,res,next){
  var UserToken = localStorage.getItem('UserToken')
  try {
    var decoded = jwt.verify(UserToken, 'LoginToken');
  }
  catch(err) {
    res.redirect('/');
  }
  next();
}








/* GET home page. */
router.get('/', function(req, res, next) {
  var Loginuser = localStorage.getItem('LoginUser');
  if(Loginuser){
    res.redirect('/home');
  }
  else{
    res.render('index', { title: 'Express',msg:'' });
  }
  
});




// form INSERT CODE
router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Express',msg:''  });
  });
  
router.post('/prashant',checkemail,checkusername,function(req, res, next) {
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var cpassword=req.body.cpassword;
   

if(password != cpassword){
  res.render('form',{title:'Password System', msg :'Password & Confirm Password Not Matched'});
}
else{
  password= bcrypt.hashSync(req.body.password,10)
  var f = new regModel({
    username:username,
    email:email,
    password:password,
    cpassword:cpassword
     
  });
    // console.log()
f.save(function(){
  regModel.find({},function(err ,data){
    if(err) throw err
    res.render('form',{title:'express', msg:'Thanks for signing up. Welcome to our community. We are happy to have you on board.'});
  })
})
}
});
  
//image upload k liye 
const Storage = multer.diskStorage({
  destination: './public/upload',
  filename:(req,file,cb) =>{        // ecma 6 function   //cb is a call back 
    cb(null, file.fieldname+"_" + Date.now() + path.extname(file.originalname));

  } 
   
})

//create Middle ware 

var upload = multer({
  storage:Storage 
}).single('file')


// home
router.get('/home',CheckLoginUser, function(req, res, next) {
  var  username = localStorage.getItem('LoginUser')
  res.render('home', { title: 'Express' ,u:username });
  });

// add
router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Express'  });
  });
 

router.post('/store',upload,function(req, res, next) {
  if(req.file){
    var imagefile = req.file.filename;
  }
  // console.log(req.body)
    
var imagefile = req.file.filename;
var pn = new userModel({
  name:req.body.n,
  image:imagefile
});

// console.log(pn);

pn.save(function(){
  userModel.find({},function(err,data){
    if(err) throw err
    res.render('add', {title : 'express',records: data});
  });
})
 
}); 
    


// Category display   
router.get('/display', function(req, res, next) {
  userModel.find({},function(err,data){
    if(err) throw err
    res.render('display', {title : 'express', records: data});
  });
})
 



// Category  ka edit   
router.get('/add_edit/:id', function(req, res, next) {
  var id= req.params.id;
   
  var edit_data=userModel.findById(id);
  edit_data.exec(function (error,data){
    if(error) throw error;
    res.render('add_edit', { title:'Express', records:data });
  });
});


// catrgory update
router.post('/up',upload, function(req, res, next) {
  if (req.file){
    var imagefile = req.file.filename
  }

var img =  userModel.findByIdAndUpdate(req.body.id,{
  name:req.body.na,
  image:imagefile
});

    
img.exec(function(err,data){
  if(err) throw err
  userModel.find({},function(err,data){
       
  if(err) throw  error;
    res.render('display', { title: 'Express',records:data });
  }) 
});
});
 


 //Category ka delete
router.get('/category_delete/:id', function(req, res, next) {
  var id= req.params.id;
   
  var del_data=userModel.findByIdAndDelete(id);
  del_data.exec(function (err,data){
    userModel.find({},function(err,data){
      if(err) throw console.error;
      res.render('display', { title: 'Express',records:data });
    });
  });
});



 
/* password details*/
router.get('/password_detail', function(req, res, next) {
  userModel.find({},function(err,data){
    if(err) throw err
  res.render('password_detail', {title : 'express', records: data});
  
  });
});

router.post('/pass', function(req, res, next) {
  var t1 = new addModel({
  name:req.body.na,
  project:req.body.pro,
  details:req.body.details,
    
  
    });
    // console.log(t)
    t1.save(function(){
      userModel.find({},function(err,data){
        if(err) throw err
      res.render('password_detail', {title : 'express', records: data});
      });
    })
    
    });
 

/*password view */
router.get('/passview', function(req, res, next) {
  addModel.find({},function(err,data){
    if(err) throw err
    res.render('passview', {title : 'express', records: data});
  });
})


/*dispaly view */
router.get('/display', function(req, res, next) {
  userModel.find({},function(err,data){
    if(err) throw err
    res.render('display', {title : 'express', records: data});
  });
})



// login check 
router.post('/', function(req, res, next) {
  var em= req.body.em;
  var pa= req.body.pa;
  var checkUser= regModel.findOne({email:em});

  checkUser.exec((err,data)=>{
    if(data==null){
      res.render('index', { title: 'Express',msg:'invalid username and password' });
    }
    
    else{
      if(err) throw err;
      // console.log(data)
      var getPassword = data.password;
      var getUserId = data._id;
      var username = data.username;

      if (bcrypt.compareSync(pa,getPassword)){
        // create web token 
        var token = jwt.sign({ UserId: getUserId }, 'LoginToken');
        localStorage.setItem('UserToken',token)
        localStorage.setItem('LoginUser',username)
        localStorage.setItem('LoginEmail',em)
        res.redirect('/home')
      }

      else{
        res.render('index', { title: 'Express', msg:'invalid username & Password' });
      }
     }
  });
   
});



// LOG OUT CODE 
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('UserToken');
  localStorage.removeItem('LoginUser');
  res.redirect('/');
});





module.exports = router;
