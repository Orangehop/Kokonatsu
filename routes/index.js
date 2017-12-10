var express = require('express');
var request = require('request');
var router = express.Router();
var passport = require('passport');

var isAuthenticated = function(req, res, next){
    if(req.user) return next();
    res.redirect("/login");
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.redirect('/index');
});

router.get('/login', passport.authenticate('provider', {scope: ['identify', 'guilds']}));
router.get('/callback', passport.authenticate('provider', { successRedirect: '/index', failureRedirect: '/login'}));

router.get('/index', isAuthenticated, function(req, res, nest) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
