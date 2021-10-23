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
})

module.exports = mongoose.model("Dish", DishSchema)