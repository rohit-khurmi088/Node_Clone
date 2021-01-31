const express = require('express');
const router = express.Router();

//Bcrypt for matching hased passwords
const bcrypt = require('bcrypt');

//User Model
const User = require('../model/User');


//====================
// SING_IN (LogIn User)
//====================
//--------------------------------
// GET: Login Page ->  loginPage
//--------------------------------
router.get('/', (req,res,next)=>{
    res.status(200).render('login',{
        pageTitle:'Login'
    });
});



//--------------------------------
// POST: Login Page -> goto '/' (HomePage)
//--------------------------------
router.post('/', async (req,res,next)=>{
    var payload = req.body

    //Check If username + password entered in login form
    if(req.body.logUsername && req.body.logPassword){

        //FIND user in database
        var user = await User.findOne({username: req.body.logUsername})
        .catch((err)=>{
            console.log(error);
            payload.errorMessage = 'Something went wrong.';
            res.status(200).render('login',payload);
        })


        //If User is Found
        if(user != null){
            //verify Password
            //Encrypt enterd password + match with hashed password in database
            //bcrypt.compare() - returns true/false
            var result = await bcrypt.compare(req.body.logPassword, user.password);
            
            //if password matches
            if(result === true){
                //set user in session + redirect to HomePage
                req.session.user = user;
                return res.redirect('/');     
            }
            //password does not matches - Incorrect + return back to login page
            payload.errorMessage = 'Login credentials incorrect';
            return res.status(200).render('login',payload);
        }
    }
    //ELSE if username + password not entered in login form -> back to login page
    payload.errorMessage = 'Make sure each field has a valid value';
    res.status(200).render('login',payload);
});


module.exports = router;