const User=require("../models/schema")
const Players=require("../models/player_schema")
const full_details=require("../models/offer_schema")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")

const handleerror=(err)=>{
      
    console.log("handleerror",err,"err.code",err.code);

   const Error={email:"",password:""}

    if (err.code === 11000){
        Error.email="this email already exist" 
       return Error;
    }

    if(err.message.includes("User validation failed")){

        Object.values(err.errors).forEach(({properties})=>{
            console.log(properties,1234556);
            Error[properties.path]=properties.message;
        })
        return Error;
    }
    else{
        Error.message=err.message;
        return Error;
    }

}

const maxage= 3*24*60*60;
const createtoken=(id)=>{
    return jwt.sign({id},"anandhu daa",{expiresIn:maxage});
};

module.exports.SignUp=async (req,res)=>{
    console.log(req.body);
    let {email,password}=req.body;
    try{
        const user_mails=await User.find({email});
        console.log("user_mails",user_mails)

        
        for(let i=0; i<user_mails.length; i++){
            if(user_mails[i].email=== email){
                throw new Error("this email already exist")
                return 
            } 
    
            else if(password.length < 6){ 
                throw new Error("minimum length is 6 characters")
            }
        }

        if(password.length < 6){  
            throw new Error("minimum length is 6 characters")
        } 
        
        const salt= await bcrypt.genSalt(); 
        password= await bcrypt.hash(password,salt);

        const singn_up_details= await User.insertMany([{email,password}]);

        const token=createtoken(singn_up_details._id);

        res.cookie('jwt', token,{ httpOnly:true, maxAge:maxage*1000});
        
       console.log("singn_up_details",singn_up_details)
        res.status(201).send(singn_up_details);
    }
    catch(error){
        const errors=handleerror(error);
        
        if(errors){
            res.status(400).send(errors)
        }
    }

}


module.exports.Login = async (req,res)=>{

    const {email,password}=req.body;
    
    
    try{
        const user=await User.Login(email,password);  
        const {age,installed_day}=await Players.find({'Player.player_id':user._id},{'Player.age':1,'Player.installed_days':1})

        
        const token=createtoken(user._id);

        res.cookie('jwt', token,{ httpOnly:true, maxAge:maxage*1000});
        
        res.status(200).json({ id : user._id })
    }
    catch(error){
        const errors=handleerror(error);

        if(errors){  
            res.status(400).send(errors)
        }
    }
}

module.exports.Logout = async (req,res)=>{ 
    res.cookie("jwt", "", { maxage:1 } )
    res.status(302).send("change url").end(); 
}

module.exports.Offer = async (req,res)=>{


    const {offer_id,offer_title,offer_description,offer_image,offer_sort_order,item_id,quantity,
    days_of_week,dates_of_month,months_of_year,age,installed_days,currency,cost}=req.body
    console.log(offer_id) 
    try{
        
        const data=await full_details.create({ 
            Offers:{
                offer_id,
                offer_title,
                offer_description,
                offer_image,
                offer_sort_order,
                "content":[{ item_id,quantity }],
                "schedule":{days_of_week, dates_of_month, months_of_year},
                "target":[{age,installed_days}],
                "pricing":[{currency,cost}]
            }
         })
       console.log(full_details)
       res.status(200).send({message:"created sucessfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).send({message:error})   
    }
}