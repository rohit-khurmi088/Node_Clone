const express = require('express');
const morgan = require('morgan');

const path = require('path');

//SASS
const sassMiddleware = require('node-sass-Middleware');
//Express-session
const session = require('express-session');

//EXPRESS BoilerPlate (for GET,POST,PUT,DELETE requests)
const app = express();

//===================
// FILE IMPORTS 
//===================
const {requireLogin} = require('./middleware');

//====================
// MIDDLEWARE
//====================
//Adding SASS: node-sass-middleware & use it just before server starts
//Precompiling Scss-->Css
app.use(sassMiddleware({
    src:'./assets/scss',         //take file from
    dest:'./assets/css',        //compile to destination
    debug: true,              //information in terminal
    outputStyle: 'extended', //multiple-lines
    prefix: '/css'          //converted-file prefix:.css
}));

//MORGAN (3rd Party Middleware): logs req. into console
//only run in development mode
app.use(morgan('dev'));

//bodyParser (To pass form data into req.body)
//extended:true => string/array(key:value) type
//extended:false => any type
app.use(express.urlencoded({extended:true})); 
app.use(express.json()); 

//SERVING Static files
app.use(express.static(path.join(__dirname,'assets'))); //OR ('./assets)

//TEMPLATE ENGINE (pug)
app.set('view engine','pug');
app.set('views','views');


// ----- EXPRESS SESSION -----
app.use(session({
    secret: 'twitterclone_xyz',
    resave: false,
    saveUninitialized: false,
}));


//======================
// ROUTING
//=======================
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

//HOMEPAGE - access on login
app.get("/", requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        user: req.session.user
    }
    res.status(200).render("home", payload);
})

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);



//Exporting app.js -> server.js
module.exports = app;