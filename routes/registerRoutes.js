const express = require('express');
const router = express.Router();

//Bcrypt for password Hashing
const bcrypt = require('bcrypt');

//User Model
const User = require('../model/User');


//====================
// SIGN_UP (REGISTER User)
//====================
//--------------------------------
// GET: SignUp Page ->  /register
//--------------------------------
router.get('/', (req,res,next)=>{
    res.status(200).render('register');
});



//--------------------------------
// POST: SignUp Page -> create User
//--------------------------------
router.post('/', async(req,res,next)=>{
    //console.log(req.body);

    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    
    //payload
    var payload = req.body;

    //Check for empty fields
    //If FIELDS ARE NOT EMPTY 
    if(firstName && lastName && username && email && password){
        //1)CHECK if user with same username OR email already exists?
        var user = await User.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage="Something went wrong."
            //render  to register.ejs
            res.status(200).render('register', payload);
        });
        
        //IF USER IS NOT FOUND
        if(user == null){
            //No User Found - Create User
            var data = req.body;
                //Hashing Password before saving in database
                data.password = await bcrypt.hash(password,10);

            User.create(data)
            .then((user)=>{
                //console.log(user);

                //set user in session
                req.session.user = user;

                //redirect to HompePage
                return res.redirect("/");
            })
        }
        else{
            //IF User Found
            //check if email entered matches the user-email in db
            if(email == user.email){
                payload.errorMessage = "Email already in use";
            }else{
                //check if username entered matches the user in db
                payload.errorMessage = "Username already in use";
            }
            //render payload to register.ejs
            res.status(200).render('register', payload);   
        }
    }
    else{
        //IF ANY OF ABOVE FIELD DOES NOT HAVE VALUE - errorMessage + render registerPage again
        //error message
        payload.errorMessage="Make sure each field has a valid value."

        //render payload to register.ejs
        res.status(200).render('register', payload);
    }
})



module.exports = router;