"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router(); //User Model

var User = require('../../model/User'); //Post Model


var Post = require('../../model/Post'); //-------------------
// GET All POSTs
//-------------------


router.get('/', function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //find() - get all Posts
          Post.find().populate("postedBy") //POPULATE User data before showing Posts
          .populate("retweetData").sort({
            "createdAt": -1
          }) //Sort by latest Post 1st (Decencing Order)
          .then(function _callee(results) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(User.populate(results, {
                      path: "retweetData.postedBy"
                    }));

                  case 2:
                    results = _context.sent;
                    //Sending Response
                    res.status(200).send(results);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })["catch"](function (error) {
            console.log(error); //Bad request

            return res.sendStatus(400);
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //-------------------
// CREATE New POST
//--------------------

router.post('/', function _callee4(req, res, next) {
  var postData;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.body.content) {
            _context4.next = 3;
            break;
          }

          console.log("Content params not found with request"); //Bad request

          return _context4.abrupt("return", res.sendStatus(400));

        case 3:
          //ELSE
          //CREATE POST
          postData = {
            content: req.body.content,
            postedBy: req.session.user
          };
          Post.create(postData).then(function _callee3(newPost) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(User.populate(newPost, {
                      path: 'postedBy'
                    }));

                  case 2:
                    newPost = _context3.sent;
                    //Post Created
                    res.status(201).send(newPost);

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })["catch"](function (error) {
            console.log(error);
            res.status(400); //Bad Request
          });

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); //---------------------------
// UPDATE LIKE/Unlike BUTTON
//---------------------------

router.put("/:id/like", function _callee5(req, res, next) {
  var postId, userId, isLiked, option, post;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          postId = req.params.id; //from Url

          userId = req.session.user._id; //loggedIn User

          console.log("userId: ", userId); // 1) ** CHECK IF USER HAS ALREADY LIKED THE POST **
          //ie. if USER has a likes[] && postId exists in likes

          isLiked = req.session.user.likes && req.session.user.likes.includes(postId); //console.log("IsLiked:",isLiked);
          //2)-- setOptions: TO LIKE OR UNLIKE POST --
          //$addToSet: add an element to arry (Set = unique); - Like Post
          //$pull: remove element from array - Unlike Post

          option = isLiked ? "$pull" : "$addToSet"; //console.log("Option:", option);
          //3)Insert/remove User likes (user likes the post)

          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            likes: postId
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 7:
          req.session.user = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            likes: userId
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 10:
          post = _context5.sent;
          //Sending Response
          res.status(200).send(post);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //---------------------------
// POST's retweet BUTTON
//---------------------------

router.post("/:id/retweet", function _callee6(req, res, next) {
  var postId, userId, deletedPost, option, repost, post;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          postId = req.params.id; //from Url

          userId = req.session.user._id; //loggedIn User

          console.log("userId: ", userId); //1) Try to delete a RETWEET 
          //(Check if POST already RETWEETED)
          //if we are able to delete a retweet => Retweet already existed (based on condition - userId, retweetData contains postId)
          //if post was not retweeted - deletedPost dont exists 
          //if post was retweetd - deletPost exists 
          //** findOneAndDelete() => delete the post + 'return deleted Post' **

          _context6.next = 5;
          return regeneratorRuntime.awrap(Post.findOneAndDelete({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 5:
          deletedPost = _context6.sent;
          //2)-- setOptions: TO Retweet OR UnRetweet POST --
          //$addToSet: add an element to arry (Set = unique); - Retweet Post
          //$pull: remove element from array - UnRetweet Post
          //if post was not retweeted - deletedPost dont exists => Retweet Post
          //if post was retweetd - deletPost exists => delete retweet(unretweet)
          option = deletedPost != null ? "$pull" : "$addToSet"; //console.log("Option:", option);
          //3) deletedPost - 'return deleted Post' 

          repost = deletedPost; //repost = null => Nothing was deleted (Create Post(retweet))
          //In case of retweet - content is not required, retweetData(by postId) = content

          if (!(repost == null)) {
            _context6.next = 12;
            break;
          }

          _context6.next = 11;
          return regeneratorRuntime.awrap(Post.create({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 11:
          repost = _context6.sent;

        case 12:
          _context6.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            retweets: repost._id
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 14:
          req.session.user = _context6.sent;
          _context6.next = 17;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            retweetUsers: userId
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 17:
          post = _context6.sent;
          return _context6.abrupt("return", res.status(200).send(post));

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = router;