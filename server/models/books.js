var mong = require('mongoose');

var Books = mong.model('Books',{
    title : {
        type:String,
        //required: true,
        minLength: 3,
        trim: true
    },
    author: {
        type:String,
        //required: true,
        minLength: 3,
        trim: true
    },
    price: {
        type: Number,
        //required: true,
    },
    rating : {
        type: Number,
      //  required: true,
    },
    sold : {
        type:Boolean,
        //required: true,
    }

})
module.exports = {Books};