const Mongoose = require("mongoose");

const player=new Mongoose.Schema({
      
    Player:{
        player_id:{
            type:String,
            required:[true, "Please enter the player_id" ]
        } ,
        age: { 
            type:Number,
            required:[true,"Please enter the age"]
        },
        country: {
            type:String,
            required:[true, "Plaese enter the country"]
        },
        installed_days:{
            type:Number,
            required:[true, "Please enter the installed days"]
        },
        coins: {
            type:Number,
            required:[true, "Please enter the coins"]
        },
        gems: {
            type:Number,
            required:[true, "Please enter the gems"]
        },
        game_level: {
            type:Number,
            required:[true, "Please enter the game_level"]
        },
        purchaser: {
            type:String,
            required:[true, "Plaese enter the purchaser"]
        }
    }
})


module.exports=Mongoose.model("Players",player);