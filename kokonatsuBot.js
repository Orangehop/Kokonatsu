var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:marginalbutter@ds047612.mlab.com:47612/kokonatsu')

var request = require('request');

var inviteLink = "https://discordapp.com/oauth2/authorize?client_id=225640184081809408&scope=bot&permissions=0x00004c00";

var AuthHeaders = {
                                    "User-Agent" : "Kokonatsu (http://test.com, v0.1)",
                                    "Authorization" : "Bot MjI1NjQwMTg0MDgxODA5NDA4.CrsBMw.TATpkjKU8ztf9nJceBCXvyy9ooM"
                                };

request.get({url: "https://discordapp.com/api/gateway", headers: AuthHeaders}, function(err, res, body){

});