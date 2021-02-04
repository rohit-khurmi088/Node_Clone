const express = require('express');
const router = express.Router();

//User Model
const User = require('../../model/User');
//Post Model
const Post = require('../../model/Post');


//-------------------
// GET All POSTs
//-------------------
router.get('/', async(req,res,next)=>{
    //find() - get all Posts
    Post.find()
    .populate("postedBy")    //POPULATE User data before showing Posts
    .populate("retweetData")
    .sort({"createdAt": -1}) //Sort by latest Post 1st (Decencing Order)
    .then(async(results)=>{
        //nested Populate(postedBy) for retweets
        results = await User.populate(results, {path:"retweetData.postedBy"})
        
        //Sending Response
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



//---------------------------
// UPDATE LIKE/Unlike BUTTON
//---------------------------
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

    //3)Insert/remove User likes (user likes the post)
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: {likes: postId}}, {new:true})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })  

    //4)Insert/remove POST likes (update user_id in Post-likes[])
    var post = await Post.findByIdAndUpdate(postId, { [option]: {likes: userId}}, {new:true})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })

    //Sending Response
    res.status(200).send(post);
});



//---------------------------
// POST's retweet BUTTON
//---------------------------
router.post("/:id/retweet", async (req,res,next)=>{

    var postId = req.params.id;        //from Url
    var userId = req.session.user._id; //loggedIn User
    console.log("userId: ", userId);
    
    //1) Try to delete a RETWEET 
    //(Check if POST already RETWEETED)
    //if we are able to delete a retweet => Retweet already existed (based on condition - userId, retweetData contains postId)
    //if post was not retweeted - deletedPost dont exists 
    //if post was retweetd - deletPost exists 
    //** findOneAndDelete() => delete the post + 'return deleted Post' **
    var deletedPost = await Post.findOneAndDelete({postedBy:userId, retweetData:postId})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })

    //2)-- setOptions: TO Retweet OR UnRetweet POST --
    //$addToSet: add an element to arry (Set = unique); - Retweet Post
    //$pull: remove element from array - UnRetweet Post
    //if post was not retweeted - deletedPost dont exists => Retweet Post
    //if post was retweetd - deletPost exists => delete retweet(unretweet)
    var option = deletedPost != null ? "$pull": "$addToSet";
    //console.log("Option:", option);

    //3) deletedPost - 'return deleted Post' 
    var repost = deletedPost;

    //repost = null => Nothing was deleted (Create Post(retweet))
    //In case of retweet - content is not required, retweetData(by postId) = content
    if(repost == null){
        repost = await Post.create({ postedBy: userId, retweetData: postId})
        .catch((error)=>{
            console.log(error);
            //Bad Request
            res.sendStatus(400);
        })
    }

    //Else if repost!= null 
    //there is a post to be deleted (repost has a value)

    //4)Insert/remove User retweets (user retweet the post) - using repostId
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: {retweets: repost._id}}, {new:true})
     .catch((error)=>{
         console.log(error);
         //Bad Request
         res.sendStatus(400);
    })  

    //5)Insert/remove POST retweet usersId (update user_id in Post- retweetUsers[])
    var post = await Post.findByIdAndUpdate(postId, { [option]: {retweetUsers: userId}}, {new:true})
    .catch((error)=>{
        console.log(error);
        //Bad Request
        res.sendStatus(400);
    })
   
    //Sending Response
    return res.status(200).send(post);
});


module.exports = router;


