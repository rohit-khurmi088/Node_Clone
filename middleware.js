


//Check If User is Logged in (checkAuthenticatedUser)
exports.requireLogin = (req,res,next)=>{
    //if session + user exists in session -> next()
    if(req.session && req.session.user){
        return next();
    }else{
        //if session + user not found -> Login
        return res.redirect('/login');
    }
}