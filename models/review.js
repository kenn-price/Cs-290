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
//========STATIC========
// Static method to get average of Dish costs
ReviewSchema.statics.getAverageRating = async function(id){
  console.log(`Calculating average cost for restaurant with ID of ${id}`)

//Create Aggregated Array
const aggregatedArray = await this.aggregate([
  //This array defines a "pipeline" that will be executed in order
  {
   $match:{restaurant: id}   
  },
  {
      $group:{
          // Get a group that has the the restaurant _id and the average of the fees
          _id:'$restaurant',
          averageRating:{$avg: '$rating'}
      },
  }
]);


//Update the restaurant with the average cost value
try{
await this.model('Restaurant').findByIdAndUpdate(id,{
  averageCost: (aggregatedArray[0].averageRating),
});
}catch (err){
  console.error(err)
}
};

// =============Middleware=========
//Call getAverageRating after saving
ReviewSchema.post('save', async function(){
  await this.constructor.getAverageRating(this.restaurant)
});
//Call getAverageCost after removing
ReviewSchema.pre('remove', async function(){
  await this.constructor.getAverageRating(this.restaurant)
});
module.exports = mongoose.model('Review', ReviewSchema)