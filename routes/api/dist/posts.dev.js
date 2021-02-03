"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router(); //User Model

var User = require('../../model/User'); //Post Model


var Post = require('../../model/Post'); //-------------------
// GET All POSTs
//-------------------


router.get('/', function (req, res, next) {
  //find() - get all Posts
  Post.find().populate("postedBy") //POPULATE User data before showing Posts
  .sort({
    "createdAt": -1
  }) //Sort by latest Post 1st (Decencing Order)
  .then(function (results) {
    res.status(200).send(results);
  })["catch"](function (error) {
    console.log(error); //Bad request

    return res.sendStatus(400);
  });
}); //-------------------
// CREATE New POST
//--------------------

router.post('/', function _callee2(req, res, next) {
  var postData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.body.content) {
            _context2.next = 3;
            break;
          }

          console.log("Content params not found with request"); //Bad request

          return _context2.abrupt("return", res.sendStatus(400));

        case 3:
          //ELSE
          //CREATE POST
          postData = {
            content: req.body.content,
            postedBy: req.session.user
          };
          Post.create(postData).then(function _callee(newPost) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(User.populate(newPost, {
                      path: 'postedBy'
                    }));

                  case 2:
                    newPost = _context.sent;
                    //Post Created
                    res.status(201).send(newPost);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })["catch"](function (error) {
            console.log(error);
            res.status(400); //Bad Request
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //--------------------
// UPDATE LIKE BUTTON
//---------------------

router.put("/:id/like", function _callee3(req, res, next) {
  var postId, userId, isLiked, option, post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
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
          //3)Insert User likes (user likes the post)

          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            likes: postId
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 7:
          req.session.user = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            likes: userId
          }), {
            "new": true
          })["catch"](function (error) {
            console.log(error); //Bad Request

            res.sendStatus(400);
          }));

        case 10:
          post = _context3.sent;
          //Sending Response
          res.status(200).send(post);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;