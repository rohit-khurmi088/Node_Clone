//(Put modules before requiring app -> avaiable in app.js)
const dotenv = require('dotenv').config();
const colors = require('colors');


//__________________________
// UNHANDLED EXCEPTIONS
//__________________________
//->declare at top
//-> used for BUGS OCCURED IN OUR Synchronous CODE BUT NOT HANDLED ANYWHERE
//x = doesn't exist
//console.log(x) -> Uncaught Exception
/*process.on('uncaughtException', err=>{
    console.log(`${err.name}: ${err.message}`.red.bold);
    //close Server & Exit Process
    process.exit(1); //MANDATORY EXIT
});*/


//========================
// DATABASE CONNECTION
//========================
const connectDb = require('./config/mongoose');
connectDb();


//========================
// Listen To Server
//=========================
const app = require('./app');

const Port = process.env.PORT || 8100;
app.listen(Port, ()=>{
    console.log(`Server is running in ${process.env.NODE_ENV} on Port: ${Port}`.yellow.bold);
});


//__________________________
// UNHANDLED REJECTIONS
//__________________________
//->declare at the end
//-> somewhere in our code there is a promise that gets rejected & is not handled anywhere
//changing Db - passsword (unable to login/connect to Db);
/*process.on('unhandledRejection', (err, promise)=>{
    console.log(`error: ${err.message}`.red.bold);
    console.log('UNHANDLED REJECTION!  Shutting down...');
    //close Server & Exit Process
    server.close(()=> process.exit(1)); //optional exit
});*/

