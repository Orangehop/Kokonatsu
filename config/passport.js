var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request = require('request');
var mongoose = require('mongoose');
var User = mongoose.model('user');

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://discordapp.com/api/oauth2/authorize',
    tokenURL: 'https://discordapp.com/api/oauth2/token',
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: 'http://'+process.env.HOSTNAME+'/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    var options = {
        url: 'https://discordapp.com/api/users/@me',
        headers: {
            'Authorization' : "Bearer " + accessToken
        }
    }

    request.get(options, function(err, response, body){
        var discordUser = JSON.parse(body);

        User.findOneAndUpdate({discordId: discordUser.id}, {username: discordUser.username,
                                                                                           discriminator: discordUser.discriminator,
                                                                                           avatar: discordUser.avatar,
                                                                                           accessToken: accessToken,
                                                                                           refreshToken: refreshToken},
                                              {new: true, upsert: true}).
        then(function(user){
            done(null, user);
        });
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});