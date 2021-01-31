const express = require('express');
const router = express.Router();


//====================
// SING_OUT (LogOut User)
//====================
//--------------------------------
// GET: Logout Page -> Destroy session
//--------------------------------
router.get('/', (req,res,next)=>{

    //If session is there -> Destroy Session + redirect to loginPage
    if(req.session){
        req.session.destroy(()=>{
            res.redirect('/login');
        })
    }
    
});




module.exports = router;