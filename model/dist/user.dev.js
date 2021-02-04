"use strict";

var mongoose = require('mongoose'); //USER Schema


var userSchema = new mongoose.Schema({
  //firstName
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  //lastName
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  //userName(unique)
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  //email(unique)
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  //password
  password: {
    type: String,
    required: true
  },
  //profilePic
  profilePic: {
    type: String,
    "default": "/images/avatar1.jpeg"
  },
  //likes => array of posts liked by the user
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  //Retweets - retweers[] - retweetes by user
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }]
}, {
  //createdAt & updatedAt
  timestamps: true
}); //USER Model

var User = mongoose.model('User', userSchema); //Exporting Model

module.exports = User;