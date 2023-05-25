const Express=require("express");
const app=Express();
const Routes=require("./components/routes/path");
const Players=require("./components/models/player_schema")
//const User=require("./components/models/schema")

app.use(Express.json());
//app.use(Express.urlencoded({extended:false}))
const cors=require("cors")
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

const cookieParser=require('cookie-parser');
app.use(cookieParser());

const session= require("express-session");
app.use(session({
    secret: 'save-me-god',
    resave: false,
    saveUninitialized: true
  }));

const Mongoose=require("mongoose"); 
require("dotenv").config();

Mongoose.connect(process.env.Mondo_db_url,{useNewUrlParser:true, useUnifiedTopology:true})
.then(data=>console.log("connected to database"),error=>console.log(error));

app.get('/',(req,res)=>{
    res.status(200).json("this is home page");
}) 

const { requireAuth } =require("./components/middleware/authentication ")
//const players_details = require("./components/controller/logic")

app.post("/players", requireAuth, async (req,res)=>{

    console.log("req.session",req.session.userId );

    console.log("req.body",req.body); 

    let {age,country,installed_days,coins,gems,game_level,purchaser}=req.body;

    let player_id=req.session.userId;
    
    
    try{  
        
        const data= await Players.create({
                Player:{
                player_id,
                age,
                country,
                installed_days,
                coins,
                gems,
                game_level,
                purchaser
            }
        });
        console.log("data",data); 
        res.status(201).json(data)
    }
    catch(error){
        
        if(error){ 
            res.status(400).send(error)
        }
    }
})


app.get("/checkuser",requireAuth)

app.use("/",Routes); 


const PORT=process.env.Port || 3000;

app.listen(PORT,()=>console.log(`app is listening to ${PORT}` ))