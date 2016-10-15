var express = require('express');
var request = require('request');
var router = express.Router();
var mongoose = require('mongoose');
var Macro = mongoose.model('macro');
var hostname = process.env.HOSTNAME;
var clientId = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;
var passport = require('passport');

var botGuildOptions = {
    url: 'https://discordapp.com/api/users/@me/guilds',
    headers: {
        "User-Agent" : "Kokonatsu (http://test.com, v0.1)",
        "Authorization" : "Bot "+process.env.BOTTOKEN
    }
}

var botGuildPromise = new Promise(function(resolve, reject){
    request.get(botGuildOptions, function (err, response, body) {
        resolve(JSON.parse(body));
    });
});

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

router.get('/getmacros', isAuthenticated, function(req, res, next) {
    botGuildPromise.then(function(botGuilds){
        var options = {
            url: 'https://discordapp.com/api/users/@me/guilds',
            headers: {
                'Authorization' : "Bearer " + req.user.accessToken
            }
        }

        request.get(options, function (err, response, body) {
            var guildIds = [];
            var guilds = JSON.parse(body);
            var sharedGuilds = [];
            guilds.forEach(function(guild){
                botGuilds.forEach(function(botGuild){
                    if(guild.id == botGuild.id){
                        guildIds.push(guild.id);
                        sharedGuilds.push(guild);
                    }
                });
            });
            Macro.find({guild: {$in: guildIds}}).
            then(function(macros){
                res.json({guilds: sharedGuilds, macros: macros});
            });
        });
    });
});

module.exports = router;
