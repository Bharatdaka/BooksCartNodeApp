require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var { mong } = require('./DBdata/mongoose');

var { Books } = require('./models/books');

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



app.get('/books',(req,res)=>{
    Books.find().then((bklist)=>{
        console.log(bklist);
        res.send(bklist);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.post('/books',(req,res)=>{
     var body = _.pick(req.body,['title', 'author', 'price', 'rating', 'sold'])
     var bk = new Books(body);
    // console.log(bk.title);

    // var todo = new Books({
    //     title: req.body.title
    // });

    bk.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });
});


if(!module.parent) {
    app.listen(3000,()=>{
        console.log("Server Started...!!");
    })
}