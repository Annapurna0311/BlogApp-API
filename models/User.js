const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username : { type: String , required:true },
    email:{type: String , required:true , unique:true},
    password:{type:String , required:true},

},{
    timestamps: true
});

// hasing things
userSchema.pre('save',async function ( next){
    const user = this;
    // if not modified then continue the hashing
    if(!user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8);
    }
    //mixing the password 10 times so that its secure enough!
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password , salt);
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;