const mongoose= require('mongoose')

const DishSchema= mongoose.Schema({
name:{
type:String,
required:[true, "Please add a team name"],
trim:true
},
description:{
    type:String,
    required:[true, "Please add a team description"]
},
dish_item:{
    type: String,
    required:[true, "Please add a dish item"],
    enum:[
        'Pasta',
           'Salad',
           'Appetizers',
            'Burgers',
            'Sandwhich',
            'Soup', 
            'Entree',
            'Seafood',
           'Steak',
           'Pork',
           'Chicken',
           'Pizza',
           'Sushi',
           'Sides',
           'Other',
           "Multiple"
    ]
},
items_on_menu:{
    type: Number,
    min:[1, "numberofitemsonMenu must be at least 1"],
    max:[50,"numberofitemsonMenu must be 50 or less"]

},
website:{
    type: String,
    match:[
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please add a vaild URL with HTTP or HTTPS',
        ],
},
averageRating:{
    type: Number,
        min:[1, "Rating must be at least 1"],
        max:[5, "Rating must be less than or equal to 5"]
},
seasonalMenu:{
    type: Boolean,
    required:true,
    default:false
}, cost:{
    type:Number,
    required:true,
    min:[0," Cost cannot be less than 0"]
},
createdAt:{
    type:Date,
    default: Date.now
},
restaurant:{
  type: mongoose.Schema.ObjectId,
  ref:'Restaurant',
  required: true,
}
});

//========STATIC========
// Static method to get average of Dish costs
DishSchema.statics.getAverageCost = async function(id){
    console.log(`Calculating average cost for restaurant with ID of ${id}`)

//Create Aggregated Array
const aggregatedArray = await this.aggregate([
    //This array defines a "pipeline" that will be executed in order
    {
     $match:{restaurant: id}   
    },
    {
        $group:{
            // Get a group that has the the restaurant _id and the average of the fees
            _id:'$restaurant',
            getAverageCost:{$avg: '$cost'}
        }
    }
]);


//Update the restaurant with the average cost value
try{
await this.model('Restaurant').findByIdAndUpdate(id,{
    averageCost: Math.ceil(aggregatedArray[0].averageCost),
});
}catch (err){
    console.error(err)
}
};

// =============Middleware=========
//Call getAverageCost after saving
TeamSchema.post('save', async function(){
    this.constructor.getAverageCost(this.restaurant)
})
//Call getAverageCost after removing
TeamSchema.pre('remove', async function(){
    this.constructor.getAverageCost(this.restaurant)
})
module.exports = mongoose.model("Dish", DishSchema)