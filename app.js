const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const accountRoute = require('./api/routes/accounts');
const transactionRoute = require('./api/routes/transactions')
const headRoute = require('./api/routes/heads')
const tranRoute = require('./api/routes/trans')

const app = express();

mongoose.connect('mongodb://localhost:27017/accountdb',{ useCreateIndex: true,useNewUrlParser: true });

// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'Its Work'
//     })
// })

// Add Morgan Before Routing to get Some Important Log

app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
// parse application/json
app.use(bodyParser.json());

// For Support Cross Origin Request
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*"); // '*' for any 
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method==='OPTIONS'){
        res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
        return res.status(200).json({});
    }

    next();
})

// This is the Api Route for Routing 
app.use('/accounts',accountRoute);
app.use('/heads',headRoute);
app.use('/trans',tranRoute);
app.use('/transactions',transactionRoute);

// Handling Error If No Request is Match to Our Route
app.use((req,res,next)=>{
    const error = new Error();
    error.status=400;
    error.message = "Route not Match"
    // Send Error to the Next
    next(error);
})

// This is Handle All Error including Route and Database Error
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;