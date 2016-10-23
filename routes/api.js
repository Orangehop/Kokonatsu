var express = require('express');
var request = require('request');
var router = express.Router();
var mongoose = require('mongoose');
var Macro = mongoose.model('macro');
var User = mongoose.model('user');
var hostname = process.env.HOSTNAME;
var clientId = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;
var passport = require('passport');


var isAuthenticated = function(req, res, next){
    if(req.user) return next();
    res.redirect("/login");
}

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

router.get('/macros', isAuthenticated, function(req, res, next) {
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

router.get('/user', isAuthenticated, function(req, res, next){
    res.json({user: req.user});
});

router.param('macroId', function(req, res, next, id){
    Macro.findById(id).
    then(function(macro){
        req.macro = macro;
        next();
    });
});

router.put('/like/:macroId', isAuthenticated, function(req, res, next){
    var macro = req.macro;
    var user = req.user;

    if(user.likes.indexOf(macro._id) != -1){
        return res.json(macro);
    }

    if(user.dislikes.indexOf(macro._id) != -1){
        user.dislikes.splice(user.dislikes.indexOf(macro._id), 1);
        macro.dislikes.splice(macro.dislikes.indexOf(user._id), 1);
        macro.score += 1;
    }

    user.likes.push(macro._id);
    user.save();
    macro.likes.push(user._id);
    macro.score += 1;
    macro.save();
    res.json(macro);
})

router.put('/dislike/:macroId', isAuthenticated, function(req, res, next){
    var macro = req.macro;
    var user = req.user;

    if(user.dislikes.indexOf(macro._id) != -1){
        return res.json(macro);
    }

    if(user.likes.indexOf(macro._id) != -1){
        user.likes.splice(user.likes.indexOf(macro._id), 1);
        macro.likes.splice(macro.likes.indexOf(user._id), 1);
        macro.score -= 1;
    }

    user.dislikes.push(macro._id);
    user.save();
    macro.dislikes.push(user._id);
    macro.score -= 1;
    macro.save();
    res.json(macro);
})


module.exports = router;