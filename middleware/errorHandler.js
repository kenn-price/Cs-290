const ErrorResponse =require('../utils/errorResponse');
const errorHandler =(err,req,res,next) => {
// Log the error to the console for debugging
console.error(err);

// Intialize default error object
 let error = {}
 error.statusCode= err.statusCode
 error.message = err.message
//Mongoose bad _id format
if(err.name === "CastError"){
const message = `Object ID ${err.value} is invalid.`
error = new ErrorResponse(message, 400)
}

// Mongoose duplicate key
if (err.code === 11000){
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
error = new ErrorResponse(message, 400);

}
// Mongoose validarion errors
if (err.name === 'ValidationsError'){
    const message =Object.values(err.errors);
    error= new ErrorResponse(message, 400);
}

//Send Json response
res.status(error.statusCode|| 500).json({
    success: false,
    error: error.message || "Server Error",
});

}

module.exports = errorHandler;