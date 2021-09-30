const express = require('express')
const dotenv = require('dotenv')


// load the dotenv variables
dotenv.config({path:"./config/config.env"})

const app = express()
const PORT = process.env.PORT || 3000

// Delete this code after
const loggingMiddleware = require('./middleware/logger')
app.use(loggingMiddleware)
// // create Routes
// app.get('/user', (req, res) =>{
// //res.send("This is my data ")--testing
// res.json({
//     success:  true,
//     data:{
//         _id: 1,
//         username:"josh"
//     }
// })
// })
/* Route Structure

/api/v1/universitites
/api/v1/teams
/api/v1/reviews
/api/v1/users

*/
// Import Routes
const universitiesRoutes = require('./routes/universities')

    // Use   routes
    app.use('/api/v1/universities',universitiesRoutes)
    

app.listen(PORT, () => {
    console.log(`Server Listening in  ${process.env.NODE_ENV} mode on port ${PORT}`)
})
