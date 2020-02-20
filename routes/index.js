const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");

//ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

//=============
//AUTH ROUTES
//=============
//show signup form
router.get("/register",(req,res)=>{
  res.render("register");
});
//handling user sign up
router.post("/register",(req,res)=>{
  User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
    if(err){
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req,res, ()=>{
      req.flash("success", "welcome to yelpCamp, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});
//show login form
router.get("/login", (req,res)=>{
  res.render("login");
});

//login logic and middleware
router.post("/login",passport.authenticate("local",{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
  }),(req,res)=>{
    console.log("welcome back");
});
//logout route
router.get("/logout",(req,res)=>{
  req.logout();
  req.flash("success", "logged you out");
  res.redirect("/campgrounds");
});


module.exports = router;
