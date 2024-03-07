if(process.env.NODE_ENV!="production"){
    require('dotenv').config();    //very important credentials are private only seen by mee so
}


// console.log(process.env.SECRET);


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");

const ejsMate=require("ejs-mate");  //to create same foooters and menubars we use ejsMate
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const ExpressError=require("./utils/ExpressError.js");//to handle error 
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash"); //to flash some message on window add to cart
const passport=require("passport"); //to authenticate
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



//connecting to database
// const mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
const db_Url=process.env.ATLASDB_URL;


main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(db_Url);
}


//ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
//show route
//to get parameters
app.use(express.urlencoded({extended:true}));

//mongo-session
const store=MongoStore.create({
    mongoUrl:db_Url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
console.log("Error in Mongo Session",err);
})

//session and protocols
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+7 * 24 * 60 * 60 * 1000,
      MaxAge:7 * 24 * 60 * 60 * 1000,
      httpOnly:true,
    }
}



// //normal route
// app.get("/",(req,res)=>{
//     res.send("Hi iam root");
// })


app.use(session(sessionOptions));
app.use(flash());


//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//to access everything to ejs which is not accessible 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
email:"student@gmail.com",
username:"delta",
    })
    let registeredUser=await User.register(fakeUser,"helloworld!");
    res.send(registeredUser);
})

//express router 
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});


//handling error
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("working well");
})


