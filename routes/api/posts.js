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
});


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
});



//--------------------
// UPDATE LIKE BUTTON
//---------------------
router.put("/:id/like", async(req,res,next)=>{

    var postId = req.params.id;        //from Url
    var userId = req.session.user._id; //loggedIn User
    console.log("userId: ", userId);
    
    // 1) ** CHECK IF USER HAS ALREADY LIKED THE POST **
    //ie. if USER has a likes[] && postId exists in likes
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    //console.log("IsLiked:",isLiked);

    //2)-- setOptions: TO LIKE OR UNLIKE POST --
    //$addToSet: add an element to arry (Set = unique); - Like Post
    //$pull: remove element from array - Unlike Post
    var option = isLiked? "$pull": "$addToSet";
    //console.log("Option:", option);

    //3)Insert User likes (user likes the post)
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: {likes: postId}}, {new:true})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })  

    //4)Insert POST likes (update user_id in Post-likes[])
    var post = await Post.findByIdAndUpdate(postId, { [option]: {likes: userId}}, {new:true})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })

    //Sending Response
    res.status(200).send(post);
});

module.exports = router;