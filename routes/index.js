var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
const postModel = require('./posts')
const upload = require('./multer')
// const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
});

router.get('/login', function(req, res, next) {
  res.render('login', {error : req.flash('error')} );
});

router.get('/feed', function(req, res, next) {
  res.render('feed', ); 
});

router.post('/upload', isLoggedIn , upload.single("file") ,async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no file were given")
  }
  //So give post id to user and userid to post on every image which you upload
  const user = await userModel.findOne({username: req.session.passport.user});
  const postdata = await postModel.create({
    image: req.file.filename,
    imageText : req.body.filecaption,
    user: user._id
  });
  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile");
}); 

router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user 
  }).populate("posts");
  console.log(user);
  res.render("profile",{user});
});

router.post("/register",function(req,res){
  const userData = new userModel({
    username:req.body.username,
    email : req.body.email,
    fullName : req.body.fullname,
  })
  userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    });
  });
});

router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash : true 
}),function(req,res){
});

router.get("/logout",function(req,res){
  req.logout(function(err){
    if (err) {return next(err);}
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
 