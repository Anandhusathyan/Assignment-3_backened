const Mongoose = require("mongoose");
const bcrypt=require("bcrypt");


const user= new Mongoose.Schema({
    email:{
        type:String,
        required:[true, "Please enter an email"],
        validate:{
            validator:(v)=>{ return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v); },
            message: props => `${props.value} is not valid email address`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[6, "minimum length is 6 characters"]
    }
})


// user.pre('save',async function(next){
// console.log("123456789")    
// const salt= await bcrypt.genSalt();
// this.password= await bcrypt.hash(this.password,salt);
// next();

// });

user.statics.Login=async function (email, password){
    const login_person=await this.find({email});
    console.log(login_person);
    if(login_person){
        console.log(123456)
        const auth= await bcrypt.compare(password,login_person[0].password)
        if(auth){
            return login_person[0]
        }
        throw new Error("incorrect password") 
    } 
    throw new Error("incorrect email")
}

module.exports = Mongoose.model("User",user);
