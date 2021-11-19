const mongoose= require('mongoose')

const ReviewSchema= mongoose.Schema({
title:{
type:String,
required:[true, "Please add a title for the review"],
trim:true,
maxlength: 100
},
text:{
    type:String,
    required:[true, "Please add some text"]
},
rating:{
    type: Number,
    required:[true, "Please add a rating"],
    min: 1,
    max:5,
},
createdAt:{
    type:Date,
    default: Date.now
},
restaurant:{
  type: mongoose.Schema.ObjectId,
  ref:'Restaurant',
  required: true,
},
user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: true,
  }
});

// Add index to user can only add one review per university
ReviewSchema.index({restaurant: 1, user: 1}, {unique: true})

module.exports = mongoose.model('Review', ReviewSchema)