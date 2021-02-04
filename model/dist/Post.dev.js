"use strict";

var mongoose = require('mongoose'); //POST Schema


var postSchema = new mongoose.Schema({
  //content
  content: {
    type: String,
    trim: true
  },
  //user(User_Object_Id)
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  //Post Pinned to Profile OR not
  pinned: Boolean,
  //likes => array of users who liked the post
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  //Retweet Users[]
  //retweet users => array of users who retweeted the post
  retweetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  //retweeted Data
  //retweetData = id's of post's we are retweeting
  retweetData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
}, {
  //createdAt & updatedAt
  timestamps: true
}); //POST Model

var Post = mongoose.model('Post', postSchema); //Exporting Model

module.exports = Post;