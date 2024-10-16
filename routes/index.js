var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
// const passport = require('passport');
const localStrategy = require("passport-local");
passport.authenticate(new localStrategy(userModel.authenticate));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn,function(req, res, next) {
  res.send("profile");
});



router.post("/register",function(req,res){
  const userData = new userModel({
    username: req.body.username ,
    email : req.body.email,
    fullName:req.body.fullName,
  });
  userModel.register(userData , req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
     res.redirect("/profile");
    });
  });
});

router.post("/login",passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect : "/"
}),function(req,res){
  

router.get("/logout",function(res,req){
  req.logout(function(err){
    if (err) { return next(err); }
    res.redirect('/');
  });
});


function isLoggedIn (req,res,next ){
  if(req.isAuthenticated()) return next();
  res.redirect("/")
}

// function isLoggedIn (req,res,next){
//   if(req.isAuthenticated()) return next();
//   res.redirect("/");
// }

});

module.exports = router;
 