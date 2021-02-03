const express = require('express');
const router = express.Router();

//User Model
const User = require('../../model/User');
//Post Model
const Post = require('../../model/Post');


//-------------------
// GET All POSTs
//-------------------
router.get('/', (req,res,next)=>{
    //find() - get all Posts
    Post.find()
    .populate("postedBy")    //POPULATE User data before showing Posts
    .sort({"createdAt": -1}) //Sort by latest Post 1st (Decencing Order)
    .then((results)=>{
        res.status(200).send(results);
    })
    .catch((error)=>{
        console.log(error);
        //Bad request
        return res.sendStatus(400);
    })
})


//-------------------
// CREATE New POST
//--------------------
router.post('/', async(req,res,next)=>{
    //if error - nothing(empty textarea) to create Post
    if(!req.body.content){
        console.log("Content params not found with request");
        //Bad request
        return res.sendStatus(400); 
    }
    //ELSE
    //CREATE POST
    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    Post.create(postData)
    .then(async newPost =>{

        //POPULATING User data -> (Populated data only available in client side not database)
        //Here we need to populate() user -> to get user model properties
        newPost = await User.populate(newPost, {path:'postedBy'});

        //Post Created
        res.status(201).send(newPost);
    })
    .catch((error)=>{
        console.log(error);
        res.status(400); //Bad Request
    });
})

module.exports = router;