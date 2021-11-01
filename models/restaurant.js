const mongoose  = require('mongoose');
const slugify = require('slugify');
const geocoder= require('../utils/geocoder')

const RestaurantSchema = new mongoose.Schema({
    name: {
            type: String,
            required: [true,"Pleasea add a Resturant name."],
            unique: [true,"That name is already taken."],
            trim: true,
            maxlength:[50," Name must be 50 characters or less"]
    },
    slug: String,// A url-friendly version of the name
    description:{
        type:String,
        required:[true,"Please add a resturant description."],
        maxlength: [500, "Description must be 500 characters or less"]
    },
    website:{
        type: String,
        match:[
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please add a vaild URL with HTTP or HTTPS"
        ]
    },
    phone:{
        type: String,
        maxlength:[20,"Phone number must be 20 characters or less"]

    },
    address:{
        type:String,
        required:[true,"Please add an adress"]
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          //required: true
        },
        coordinates: {
          type: [Number],
         // required: true
        },
        formattedAddress: String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String,
      },
    owner:{         ////// confused would this replace coach
        type: String,
        trim: true,
        maxlength:[50,"owner's name must be 50 characters or less"]
    },
    items:{
        type: [String],
        enum: [
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
           'Other'
        ]
    },
    averageRating:{
        type: Number,
        min:[1, "Rating must be at least 1"],
        max:[5, "Rating must be less than or equal to 5"]
    },
    averageCost:{
        type:Number,
    },
    photo:{
        type: String,   // Just the file name
        default: "no-photo.png"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    hours:{
        type:String,
        min:"00:00",
        max:"24:00",
        required:[true," Has to be military time between 0:00-24:00 hours"]
    }
},{
    toJSON: {virtuals: true},
    toObject:{ virtuals: true},
    id: false
});
// Will be adding mongoose middleware later that calculated lots of there fields.
//=============Middleware================
//create Slug Name
RestaurantSchema.pre('save',function(next){
    this.slug=slugify(this.name,{
        lower: true,
        replacement:'_',

    })
    next();
});
// Geocode and create location field
RestaurantSchema.pre('save', async function(next){
const query = await geocoder.geocode(this.address)
const loc = query[0]
this.location ={
    type:"Point",
    coordinates:[loc.longitude, loc.latitude],
    formattedAddress:loc.formattedAddress,
    street:loc.streetName,
    city:loc.city,
    state:loc.stateCode,
    zipcode: loc.zipcode,
    country: loc.countryCode,
}

// Dont save address in DB, since we have a better representation as a geocode
this.address=undefined;
next();
});
// cascade delete dish when a resturant is deleted
RestaurantSchema.pre('remove', async function(next) {
    await this.model('Dish').deleteMany
({restaurant: this._id})
next()
});
//=========Virtuals ========

//Reverse populate with virtuals
RestaurantSchema.virtual('dishes',{
    ref:'Dish',
    localField:'_id',
    foreignField:'restaurant',
    justOne: false
})
module.exports=mongoose.model("Restaurant",RestaurantSchema);