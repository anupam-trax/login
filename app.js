
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-anupam:av1234@cluster0.pool2y1.mongodb.net/loginDB");

const loginSchema = new mongoose.Schema({
    userName : String,
    password: String
});

const Login = mongoose.model("login",loginSchema);

Login.findOne({ userName: "admin@gmail.com" }).exec().then((foundUser) => {
    if (!foundUser) {
      // If the admin user doesn't exist, create it and save it to the database
      const admin = new Login({
        userName : "admin@gmail.com",
        password: "admin@123"
      });
  
      admin.save();
    }
  }).catch((err) => {
    console.log(err);
  });
  

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

    res.sendFile(__dirname + "/index.html");
});

app.get("/wrongpass",function(req,res){
    res.sendFile(__dirname+"/wrongpass.html");
}); 

app.get("/create",function(req,res){
    res.sendFile(__dirname+"/create.html");
});

app.get("/forgot",function(req,res){
    res.sendFile(__dirname+"/forgot.html");
});


app.post("/",function(req,res){

    let enteredUsername = req.body.userName;
    let enteredPassword = req.body.password;

    Login.findOne({userName:enteredUsername}).exec().then((foundUser)=>{
        console.log("The founded User is ");
        console.log(foundUser);

        if(foundUser){
            if(enteredUsername === foundUser.userName && enteredPassword === foundUser.password){
                console.log("Access granted");
                res.sendFile(__dirname+"/dash.html");
            }else{
                res.redirect('/wrongpass');
            }
        }else{
            res.sendFile(__dirname+"/create.html");
        }

    })

});

app.post("/create",function(req,res){

    let enteredUsername = req.body.userName;
    let enteredPassword = req.body.password;


      Login.findOne({ userName: enteredUsername  }).exec().then((foundUser) => {
        if (!foundUser) {
          // If the no user is present with the same username
          const newUser = new Login({
            userName : enteredUsername,
            password: enteredPassword
          });
      
          newUser.save();

          res.sendFile(__dirname+"/dash.html");

        }else{
            res.sendFile(__dirname+"/alreadyuser.html");
        }

      }).catch((err) => {
        console.log(err);
      });
      
});

app.post("/forgot",function(req,res){
    let enteredUsername = req.body.userName;
    let enteredPassword = req.body.password;

    Login.findOne({ userName: enteredUsername  }).exec().then((foundUser) => {
        if (foundUser) {
          // If the user is present with the username
        
          Login.updateOne({userName:enteredUsername},{password:enteredPassword}).exec().then(function(){
            res.redirect("/");
          }).catch((err) =>{
            console.log(err);
          });
        }else{
            res.redirect("/create");
        }

      }).catch((err) => {
        console.log(err);
      });


})

app.listen(process.env.PORT||3000,function(){
    console.log("Server Started On Port 3000");
});
