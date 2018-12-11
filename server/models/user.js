var mongoose = require('mongoose');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true, //find methods in mongoosejs.com/docs
        minLength: 1,
        trim: true,
        unique: true,
        validate:{
            //validator: validator.isEmail,    
            
            validator :(value)=>{
                return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid email"
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    username:{
        type: String,
        required: true,
        minlength: 5,
        //unique: true
    }


    // tokens:[{
    //     access:{
    //         type: String,
    //         required: true,    
    //     },
    //     token:{
    //         type: String,
    //         required: true,    
    //     }
    // }]
});


UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
  
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
            } 
            else {
            reject();
          }
        });
      });
    });
  };
  

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        }); 
    }
    else{
        next();
    }
});


UserSchema.methods.toJSON = function (){
    var user = this;
    var userObj = user.toObject();
    
    return _.pick(userObj,['_id','email']);
};

var User = mongoose.model('User',UserSchema);


module.export={User};