var mong = require("mongoose");

mong.Promise = global.Promise;

mong.connect(process.env.MONGODB_URI,{useNewUrlParser:true});

module.exports = { mong };