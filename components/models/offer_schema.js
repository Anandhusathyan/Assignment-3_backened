const Mongoose=require("mongoose")

const offer = new Mongoose.Schema({


    Offers: 
        {
            offer_id: {
                type:String
            },
            offer_title: {
                type:String
            },
            offer_description: {
                type:String 
            },
            offer_image: {
                type:String
            }, 
            offer_sort_order: {
                type:String
            },
            content: [ { item_id: {type:String}, quantity: {type:Number} } ],
          
            schedule: { days_of_week: [type=String], dates_of_month: [type=Number], months_of_year: [type=String] },

            target:[ {age:{type: String}  , installed_days:{type: String}} ],

            pricing: [{ currency: {type:String}, cost: {type:Number} }]
        }

})


module.exports = Mongoose.model("full_details",offer)
