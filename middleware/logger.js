const loggingMiddleware = (req, res, next) => {
    // Gwet the JWT and query DB to get user
    req.user = "michaek reeves"
    console.log("Method: ", req.method, "url:",req.url)
    next()
}
module.exports = loggingMiddleware