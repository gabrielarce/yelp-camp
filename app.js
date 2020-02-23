var   express   = require("express"),
          app   = express(),
           bp   = require("body-parser"),
        flash   = require('connect-flash'),
     mongoose   = require("mongoose"),
     passport   = require("passport"),
LocalStrategy   = require("passport-local"),
methodOverride  = require("method-override"),
   Campground   = require("./models/campground"),
      Comment   = require("./models/comment"),
         User   = require("./models/user")
       seedDB   = require("./seeds");
//REQUIRING ROUTES
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp11";
console.log(process.env.DATABASEURL);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {
   useNewUrlParser: true,
   useUnifiedTopology: true
 }).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});



app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedDB() //

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Once again Orion is the cutest dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) ;
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 9999, ()=>{
  console.log("Your deployment version of YelpCamp is now running!")
});
