const express=require("express");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
var fs = require('fs');
var path = require('path');
require('dotenv/config');
var multer = require('multer');
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM(`<!DOCTYPE html>`);
var $ = require("jquery")(dom.window);
const app=express();
var theme;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
try{
mongoose.connect('mongodb+srv://pekka:pekka423$@cluster0.hptlr.mongodb.net/userdata?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true});
}
catch(e)
{
  console.log("could not connect");
}
var name;
const userschema={
  name:String,
  email:String,
  password : String,
  profileimg :
  {
    data: Buffer,
    content :String
  },
  postimg :
  {
    data: Buffer,
    content :String
  },
  theme:String
};
const user=mongoose.model("user",userschema);


app.get("/",function(req,res)
{
  res.render("index",{invalid:" ",incorrectform:" ",incorrect:"incorrect",account:"account",signin:" ",signup:"signup",wrongpass:"signup"});
});

app.post("/",function (req,res)
{

if(req.body.username1!=undefined)
{

  user.find(function(err,founduser)
{
  var p=0;
  for(var i=0;i<founduser.length;i++){
  if(req.body.mail1==founduser[i].email)
  {
    p=1;
  }
}
if(p!=1)
{
  checker();

}
else
{
  existinguser();
}
});
function checker(){
if((req.body.pass1!=req.body.pass2))
{
  res.render("index",{invalid:" ",incorrectform:" ",incorrect:" ",account:"account",signin:"signup",signup:" ",wrongpass:" "});
}
else{
  newuser();
}
}
  function newuser(){
    user.create([{
      name:req.body.username1,
      email:req.body.mail1,
      password : req.body.pass1,
      theme:"light"
    }],function(err){});
    res.redirect("/");
  }
  function existinguser()
  {

    res.render("index",{invalid:"invalid-feedback",incorrectform:"is-invalid",incorrect:" ",account:"account",signup:" ",signin:"signup",wrongpass:"signup"});

  }


}

if(req.body.username!=undefined){
  user.find(function(err,founduser)
{ var m=0;
  for(var i=0;i<founduser.length;i++)
  {
  if((founduser[i].name==req.body.username || founduser[i].email==req.body.username)&& founduser[i].password==req.body.userpassword)
  {

    m=1;
    name=founduser[i].name;
    theme=founduser[i].theme;
    if(theme=="light"){
    res.render("dashboard",{name:name,htmlbody:" ",navdark:"navbar-dark bg-dark",dark:"bg-light",headerdark:"bg-primary text-white"});
  }
    else
      {
        res.render("dashboard",{name:name,htmlbody:"darktheme",navdark:"darknav",dark:" ",headerdark:"darkheader"});
      }
    break;
  }
}

  if(m!=1)
  {
    res.render("index",{invalid:"invalid-feedback",incorrectform:"is-invalid",incorrect:" ",account:" ",signin:" ",signup:"signup",wrongpass:"signup"});
  }
});

}

});




var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });



app.get("/setting.html",function(req,res){
  if(theme=="light"){
  res.render("setting",{name:name,htmlbody:" ",navdark:"navbar-dark bg-dark",dark:"bg-light",headerdark:"bg-primary text-white",darkbutton:"",bodydark:"",cardheaddark:"",cardbodydark:"",cardborder:"",lightchecked:"checked",darkchecked:""});
}
  else
    {
      res.render("setting",{name:name,htmlbody:"darktheme",navdark:"darknav",dark:" ",headerdark:"darkheader",darkbutton:"darktheme",bodydark:"darktheme",cardheaddark:"darkheader",cardbodydark:"darkcard",cardborder:"border-0",lightchecked:"",darkchecked:"checked"});
    }
});

app.get("/login.html",function(req,res){
  if(theme=="light"){
  res.render("login",{name:name,htmlbody:" ",navdark:"navbar-dark bg-dark",dark:"bg-light",headerdark:"bg-primary text-white",darkbutton:"",bodydark:"",cardheaddark:"",cardbodydark:"",cardborder:"",lightchecked:"checked",darkchecked:"",profilephoto:"/img/avatar.png"});
}
  else
    {
      res.render("login",{name:name,htmlbody:"darktheme",navdark:"darknav",dark:" ",headerdark:"darkheader",darkbutton:"darktheme",bodydark:"darktheme",cardheaddark:"darkheader",cardbodydark:"darkcard",cardborder:"border-0",lightchecked:"",darkchecked:"checked"});
    }
});


app.post('/login.html', upload.single('image'), function(req, res, next){
console.log(req.file);
    var obj = {
        profileimg: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            content: 'image/png'
        }
    }
    user.create(obj, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/dashboard.html');
        }
    });
});





app.get("/dashboard.html",function(req,res){
  if(theme=="light"){
  res.render("dashboard",{name:name,htmlbody:" ",navdark:"navbar-dark bg-dark",dark:"bg-light",headerdark:"bg-primary text-white"});
}
  else
    {
      res.render("dashboard",{name:name,htmlbody:"darktheme",navdark:"darknav",dark:" ",headerdark:"darkheader"});
    }
});

app.get("/post.html",function(req,res){
  res.render("post",{name:name});
});
app.get("/category.html",function(req,res){
  res.render("category",{name:name});
});
app.get("/user.html",function(req,res){
  res.render("user",{name:name});
});

app.get("/details.html",function(req,res){
  res.render("details",{name:name});
});
app.get("/index.html",function(req,res){
  res.redirect("/");
});




app.post("/setting.html",function(req,res)
{
  console.log(req.body);
  if(req.body.theme=="dark")
  {
    theme="dark";
    user.update({name:name}, { $set: { theme: theme }},function(err, res){});
res.redirect("/setting.html");
  }
  else{
    theme="light";
    user.update({name:name}, { $set: { theme: theme }},function(err, res){});
  res.redirect("/setting.html");
}
});













app.listen(1400,function(){
  console.log("server started");
});
