var mongoose = require("mongoose");
var bcrypt = require("bcrypt");



var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics.authenticate = function (username, password, next) {
    User.findOne({username: username}).exec(function (err, user){
        if (err) return next(err);
        if (!user) {
            var err = new Error('User not found');
            err.status = 401;
            return next(err);
        }
        
        bcrypt.compare(password, user.password, function(err, result){
            if (result === true){
                return next(null, user);
            } else {
                return next();
            }            
        });
    });
}


var User = mongoose.model('User', UserSchema);
module.exports = User;