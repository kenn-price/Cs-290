const crypto = require('crypto')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required:[true,'Please add a username'],
        unique: true,
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique: true,
        match:[
           /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ ,
        'Please enter valid email',
        ],
    },
    role:{
        type: String,
        enum:['user','publisher'], // admin will be assigned directly in DB
        default:'user'
    },
    password:{
        type: String,
        required:[true,'Please add a password'],
        minlength: 12,
        select: false //Whenever API GETS a user, this field is not returned
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default:Date.now,
    },


});
// ========= MIDDLEWARE=========   
//Hash password when registering user
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    // Generate salt
    const salt= await bcrypt.genSalt(10)

    // Hash Password
    this.password= await bcrypt.hash(this.password, salt);
});


// ==========METHODS======(MANUALLY RAN)
//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    });
};

//Match user-entered password to hashed password in DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken= function(){
    // Generate token
const resetToken = crypto.randomBytes(25).toString('hex')
    // Hash the token and set resetPasswordToken field
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // Ste expiration
this.resetPasswordExpire = Date.now() + 10*60*1000  

// Return token
return resetToken;
};

module.exports= mongoose.model('User', UserSchema)