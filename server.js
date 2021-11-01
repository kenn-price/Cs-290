// Import NPM Packages
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const fileupload = require('express-fileupload')

//Import Local Files
const connectToDB = require('./config/connectToDB');
const errorHandler =require('./middleware/errorHandler');


// load the dotenv variables
dotenv.config({path:"./config/config.env"})

//configure express
//Express Config
const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json());

//Connect to DB
connectToDB();

//File uploading
app.use(fileupload());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Delete this code after
const loggingMiddleware = require('./middleware/logger')
app.use(loggingMiddleware)
// Import routes
const restaurantsRoutes = require('./routes/restaurants')
const dishRoutes = require('./routes/dishes')
const authRoutes = require('./routes/auth')

    // Use   routes
    app.use('/api/v1/restaurants',restaurantsRoutes);// DO I need to change from plural to singular
    app.use('/api/v1/dishes',dishRoutes);
    app.use('/api/v1/auth', authRoutes);
    
// Error Handling Middleware- MUST BE LAST APP.USE();
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`Server Listening in  ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle any unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
// log the problem to the console
console.log(`Unhandled Promise Rejection: ${err.message}`)
// STop the server and the process
server.close(() => {
process.exit(1)
});
});