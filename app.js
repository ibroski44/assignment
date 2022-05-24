//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema=new mongoose.Schema ({
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: String,
  userName: String,
  password: String,
  secret: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedField: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login")
});
app.get("/register", function(req, res){
  res.render("register")
});
app.get("/secrets", function(req, res){
if (req){
  res.render("secrets");
} else {
  res.redirect("/login");
}
});
app.get("/submit", function(req, res){
  if (req){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
  });
app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  console.log(submittedSecret);
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){
  const newUser = new User ({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    userName: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    dateOfBirth: req.body.date_of_birth,
    
   
  });
  newUser.save(function(err){
    if (err) {
      console.log(err)
    } else {
      res.render("secrets");
    }    
  });
});

app.post ("/login", function(req, res){
  const username= req.body.username;
  const password= req.body.password;

  User.findOne({userName: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});

