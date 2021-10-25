const mongoose = require('mongoose')
const fs = require('fs')
const dotenv= require('dotenv')
//const dotenv = require('colors')

// Load dotenv  variables
dotenv.config({path:"./config/config.env"})

// Load models
const Restaurant = require('./models/restaurant')
const Dish= require('./models/dish')

//Connect to DB
mongoose.connect(process.env.DB_URI, {

});

//Load JSON files
const restaurants =JSON.parse(fs.readFileSync(`${__dirname}/data/restaurants.json`, 'utf-8'))
const dishes =JSON.parse(fs.readFileSync(`${__dirname}/data/dishes.json`, 'utf-8'))


//Import into DB
const importData = async () => {
    try{
        await Restaurant.create(restaurants);
       // await Dish.create(dishes);
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
