require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),  
  indexRoutes = require("./routes/index"),    
  flash = require("connect-flash"),  
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);  

//seedDb();
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log("Error:", err.message);
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(flash());


//Passport configuration
app.use(
  session({
    secret: "Email Verfication",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.DATABASE_URL,
      touchAfter: 24 * 3600 // time period in seconds
    })    
  })
);

app.use(passport.initialize());
app.use(passport.session());

//passport.use(new LocalStrategy(User.authenticate()));
passport.use("local", new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, async (email, password, done) => {
  try{
    // 1. Check if email already exists
    const user = await User.findOne({email: email});

    if(!user){
      return done(null, false, { message: 'Unknown User' });
    }

    // 2. Check if password is correct
    const isValid = User.comparePassword(password, user.password);
    if(!isValid){
      return done(null, false, { message: 'Unknown Password' });
    }

    // 3) Check if email has been verified
    if (!user.isVerified) {
      return done(null, false, { message: 'Your account has not been activated yet.\n\n Please complete verification email.' });
    }

    return done(null, user);
  } catch(error){
    return done(error, false);
  }
}));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is listening at port " + port);
});
