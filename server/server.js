require('../config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var { mong } = require('../DBdata/mongoose');

var { Books } = require('../models/books');

var app = express();


// app.get('/home',(req,res)=>{
//     Books.find().then((bklist)=>{

//     })
// });

app.post('/books',(req,res)=>{
    var body = _.pick(req.body,['title', 'author', 'price', 'rating', 'sold'])
    var bk = new Books(body);
    console.log(body);

    bk.save().then((doc)=>{
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