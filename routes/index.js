var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/todo");
});

router.get('/login', function(req, res, next) {
  if (req.session && req.session.userId) {
      return res.redirect('/');
  }
  res.render('login');
});

router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password){
      User.authenticate(req.body.username, req.body.password, function (error, user){
          if (error || !user){
              var err = new Error('Wrong username or password');
              err.status = 401;
              return next(err);
          } else {
              req.session.userId = user._id;
              res.redirect('/');
          }
      });
  } else {
      var err = new Error('Both username and password must be provided');
      err.status = 400;
      return next(err);
  }
});

router.get('/logout', function(req, res, next){
    if (req.session) {
        req.session.destroy(function(err){
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
            
        });
    }
});                            

module.exports = router;
