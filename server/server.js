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



// app.get('/home',(req,res)=>{
//     Books.find().then((bklist)=>{

//     })
// });

app.post('/books',(req,res)=>{
     var body = _.pick(req.body,['title', 'author', 'price', 'rating', 'sold'])
     var bk = new Books(body);
    // console.log(bk.title);

    // var todo = new Books({
    //     title: req.body.title
    // });

    bk.save().then((doc) => {
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