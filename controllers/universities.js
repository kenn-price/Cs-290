exports.getUniversities = (req,res, next) => {
    res.status(200).json({
        success: true,
        data:"Get all universities ",
        user: req.user
    })
}

exports.getUniversity = (req,res, next) => {
    res.status(200).json({
        success: true,
         data:`Get information about university with ID of ${req.params.id}`
    })
}

exports.createUniversity= (req,res, next) => {
    res.status(201).json({
        success: true,
       data:"Create new uiversity"
   })
}

exports.updateUniversity= (req,res, next) => {
    res.status(200).json({
        success: true,
        data:`Update university with ID of ${req.params.id}`
    })
}
exports.deleteUniversity = (req,res, next) => {
    res.status(200).json({
        success: true,
        data:` Delete university with ID of ${req.params.id}`
    })
}