require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { ObjectID } = require('mongodb');
var { mong } = require('./DBdata/mongoose');

var { Books } = require('./models/books');
var { User } = require('./models/user');



var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// user sign up api
app.post('/signup',(req,res)=>{
    var body = _.pick(req.body,['email','password','username']);
    var user = new User(body);
    console.log(body);

    let promise = User.findOne({email:req.body.email}).exec();
    promise.then(function(doc){
        if(doc){
            return res.status(501).json({message : ' Email Id exits'});
        }
        else{
            user.save().then((doc)=>{
                res.send(doc);
             },(err)=>{
                 res.status(404).send(err);
            });
        }
    });
    
});

//user sign in api
app.post('/signin',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    // var user = new User(body);
    console.log(body);

    // User.findByCredentials(body.email, body.password)
    //     .then((result) => {
    //         return user.generateToken().then((ret => {
                
    //         }));
    //     });

    let promise = User.findOne({email:req.body.email}).exec();
    promise.then(function(doc){
        if(doc){
            // if(doc.isValid(req.body.password)) {
            User.findByCredentials(body.email, body.password).then((doc) => {
            // generate token
                let token = jwt.sign({username:req.body.username}, 'secret', {expiresIn: '1h'});
                // promise.save();
                //doc.save();
                return res.status(200).json(token);
                }, (err) => {
                    return res.status(501).json({message : ' Invalid Credentials'});
            });
        }
        else{
            return res.status(501).json({message : ' Invalid Email Id'});
        }
    });

});



app.get('/books', verifyToken, (req,res)=>{
    Books.find().then((bklist)=>{
        // console.log(bklist);
        res.send(bklist);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.post('/books', verifyToken, (req,res)=>{
     var body = _.pick(req.body,['title', 'author', 'price', 'rating', 'sold'])
     var bk = new Books(body);
    // console.log(bk.title);

    // var todo = new Books({
    //     title: req.body.title
    // });

    bk.save().then((doc) => {
        // console.log(doc);
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/books/:id',(req,res)=>{
    console.log("hello world");
    var id = req.params.id;
    console.log(id);
    Books.find({"_id":ObjectID(id)}).then((bklist)=>{
        console.log(bklist);
        res.send(bklist);
    },(err)=>{
        res.status(400).send(err);
    });
});


function verifyToken(req, res, next) {
    console.log("bharat");
    console.log(req.headers);
    next();
}

if(!module.parent) {
    app.listen(3000,()=>{
        console.log("Server Started...!!");
    })
}