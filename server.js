// Import NPM Packages
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const fileupload = require('express-fileupload')
const cookieParser= require('cookie-parser')
const mongoSanitize= require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit= require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

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

//Allows CORS
app.use(cors())

// Cookie Parser
app.use(cookieParser())

//Connect to DB
connectToDB();

//File uploading
app.use(fileupload());

//Sanitize input
app.use(mongoSanitize());

//Set security header
app.use(helmet());

// Prevent XSS Attacks
app.use(xssClean());

//Rate Limiter
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_MINUTES * 60 *1000,
    max:process.env.RATE_LIMIT_REQUESTS,
    message:`Too many requests. You are only allowed ${process.env.RATE_LIMIT_REQUESTS} requests per ${process.env.RATE_LIMIT_MINUTES} minutes`
})
app.use(limiter)

// Prevent hpp param pollution
app.use(hpp());
//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Delete this code after
const loggingMiddleware = require('./middleware/logger')
app.use(loggingMiddleware)
// Import routes
const restaurantsRoutes = require('./routes/restaurants')
const dishRoutes = require('./routes/dishes')
const authRoutes = require('./routes/auth')
const userRoutes= require('./routes/users')
const reviewRoutes= require('./routes/reviews')


    // Use   routes
    app.use('/api/v1/restaurants',restaurantsRoutes);// DO I need to change from plural to singular
    app.use('/api/v1/dishes',dishRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users',userRoutes)
    app.use('/api/v1/reviews',reviewRoutes)

    
// Error Handling Middleware- MUST BE LAST APP.USE();
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`Server Listening in  ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle any unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
// log the problem to the console
console.log(`Unhandled Promise Rejection: ${err.message}`);
console.log(err);
// STop the server and the process
server.close(() => {
process.exit(1)
});
});