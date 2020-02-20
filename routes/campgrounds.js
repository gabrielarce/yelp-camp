const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX ROUTE - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/index", {
               campgrounds:allCampgrounds,
             }); //data + name passing in
        }
        });

});

//CREATE - add new campgrounds to database
router.post("/", middleware.isLoggedIn,function (req, res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var price = req.body.price
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    console.log(req.user);
   //create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
      if (err) {
          console.log(err);
      } else {
           // redirect back to campgrounds page
          res.redirect("/campgrounds"); //
      }
   });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new")
});

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
router.get("/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err || !foundCampground) {
           req.flash("error", "Campground not found");
           res.redirect("back");
       } else {
            //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// EDIT CAMPGROUND ROUTES
router.get("/:id/edit", middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id, (err,foundCampground)=>{
      if(err){
        req.flash("error", "You do not have permission to do that.")
        res.redirect("/campgrounds");
      }else{
        res.render("campgrounds/edit", {campground: foundCampground});
      }
    });
});

//UPDATE CAMPGROUND ROUTES
router.put("/:id", middleware.checkCampgroundOwnership,(req,res)=>{
  //findById
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
    if(err){
      res.redirect("/campgrounds")
    }else{
      res.redirect("/campgrounds/" + req.params.id)
    }
  });
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
  Campground.findByIdAndRemove(req.params.id, (err,deletedCampground)=>{
    if(err){
      console.log(err)
      res.redirect("/campgrounds")
    }else{
      res.redirect("/campgrounds")
    }
  });
});

module.exports = router
