const mongoose = require('mongoose');

//USER Schema
const userSchema = new mongoose.Schema({
    //firstName
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    //lastName
    lastName:{
        type:String,
        required:true,
        trim:true
    },

    //userName(unique)
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    //email(unique)
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },

    //password
    password:{
        type:String,
        required: true
    },

    //profilePic
    profilePic:{
        type:String,
        default:"/images/avatar1.jpeg"
    }
},{
    //createdAt & updatedAt
    timestamps:true
})

//USER Model
const User = mongoose.model('User',userSchema);

//Exporting Model
module.exports = User;