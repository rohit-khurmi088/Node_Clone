const mongoose = require('mongoose');

//POST Schema
const postSchema = new mongoose.Schema({
    //content
    content:{
        type:String,
        trim:true,
    },
    //user(User_Object_Id)
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //Post Pinned to Profile OR not
    pinned:Boolean,
    
    //likes => array of users who liked the post
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{
    //createdAt & updatedAt
    timestamps:true
})

//POST Model
const Post = mongoose.model('Post',postSchema);

//Exporting Model
module.exports = Post;