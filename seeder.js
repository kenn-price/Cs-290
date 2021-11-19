const mongoose = require('mongoose')
const fs = require('fs')
const dotenv= require('dotenv')
//const dotenv = require('colors')

// Load dotenv  variables
dotenv.config({path:"./config/config.env"})

// Load models
const Restaurant = require('./models/restaurant')
const Dish= require('./models/dish')
const User = require('./models/user')
const Review = require('./models/review')

//Connect to DB
mongoose.connect(process.env.DB_URI, {

});

//Load JSON files
const restaurants =JSON.parse(fs.readFileSync(`${__dirname}/data/restaurants.json`, 'utf-8'))
const dishes =JSON.parse(fs.readFileSync(`${__dirname}/data/dishes2.json`, 'utf-8'))
const users =JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'))
const reviews =JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'))


//Import into DB
const importData = async () => {
    try{
       await User.create(users)
        await Restaurant.create(restaurants);
       await Dish.create(dishes);
       await Review.create(reviews);
        console.log("Data imported...")
        process.exit(0)
    }catch (err){
        console.error(err)
        process.exit(1)
    }
}

// Delete into DB
const deleteData = async () => {
    try{
        await Restaurant.deleteMany();
        await Dish.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
        console.log("Data deleted...")
        process.exit(0)
    }catch (err){
        console.error(err)
        process.exit(1)
    }
};


//Parse arguments from CLI
if(process.argv[2]==="-i"){
    importData()
} else if (process.argv[2]=== "-d") {
   deleteData() 
}else{
    console.log("You must pass an argument: -i")
    process.exit(3);
}
