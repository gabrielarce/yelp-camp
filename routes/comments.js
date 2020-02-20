const express = require("express");
const router  = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
//================
// COMMENTS ROUTES
//================
router.get("/new", middleware.isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err,campground)=>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{campground:campground});
    }
  });
});
//Comments create
router.post("/", middleware.isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err,campground)=>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds")
    }else{
      Comment.create(req.body.comment, (err, comment)=>{
        if(err){
          console.log(err);
        }else{
          //add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          console.log("New comment username will be: " + req.user.username);
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res)=>{
  Campground.findById(req.params.id, (err, foundCampground)=>{
    if(err || !foundCampground){
      req.flash("error", "No Campground FOund");
      return res.redirect("back");
    }
   });
    Comment.findById(req.params.comment_id,(err, foundComments)=>{
      if(err){
        res.redirect("back");
      }else{
        res.render("comments/edit",{campground_id: req.params.id, comment: foundComments});
      }
    });
});
//COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/"+ req.params.id)
    }
  });
});
//COMMENTS DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
  //find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
