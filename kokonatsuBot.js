// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/');

var request = require('request');

var WebSocket = require('ws');

var inviteLink = "https://discordapp.com/oauth2/authorize?client_id=225640184081809408&scope=bot&permissions=0x00004c00";
var clientId = "225640184081809408";
var clientSecret = "nEix9aTh-WG0dDcqUnv6swgQ8FmlVG6I";
var botToken = "MjI1NjQwMTg0MDgxODA5NDA4.CrxrOw.aKPI8pIeKgwiQJOM02A_cQiCEKQ";

var AuthHeaders = {
                                    "User-Agent" : "Kokonatsu (http://test.com, v0.1)",
                                    "Authorization" : "Bot MjI1NjQwMTg0MDgxODA5NDA4.CrsBMw.TATpkjKU8ztf9nJceBCXvyy9ooM"
                                };

var socket;
var heartbeatInterval;
var d = null, s = null;
var sessionId;

getGatewayUrl(function(url){
    console.log(url);
    socket = new WebSocket(url);

    socket.on('message', function(data, flags){
        opHandler(JSON.parse(data));
    });

    socket.on('open', function(){
        console.log("connected to gateway");
    });
});

function getGatewayUrl(callback){
    request.get({"url": "https://discordapp.com/api/gateway", "headers": AuthHeaders}, function(err, res, body){
        if(err){
            console.log(err);
        }

        if(res.statusCode == 200){
            var url = JSON.parse(body).url+'/?encoding=json&v=5';
            callback(url);
        }

        else{
            console.log(res.statusCode + ': ' + body);
        }
    });
}

function gatewayIdentify(){
    socket.send(JSON.stringify({op: 2, d: {
                                                                    token: botToken,
                                                                    large_threshold: 250,
                                                                    compress: false,
                                                                    properties: {
                                                                      $os: 'discord.js',
                                                                      $browser: 'discord.js',
                                                                      $device: 'discord.js',
                                                                      $referrer: '',
                                                                      $referring_domain: '',
                                                                    },
                                                                    shard: [1,10]
                                                                }
    }));
}

function gatewayResume(){
    socket.send(JSON.stringify({op: 6, d: {token: botToken, session_id: sessionId, seq: s} }));
}

function opHandler (data){
    switch(parseInt(data.op)){
        // dispatch
        case   0:
            s = data.s;
            eventHandler(data.t, data.d);
            break;
        // Reconnect
        case   7:
            // socket.close();
            gatewayResume();
            break;
        // Invalid Session
        case   9:
            console.log("invalid session. op: 9");
            gatewayIdentify();
            break;
        // Hello
        case 10:
            heartbeatInterval = data.d.heartbeat_interval;
            if(typeof sessionId !== 'undefined'){
                console.log("resuming previous session: "+sessionId);
                gatewayResume();
            }
            else{
                console.log("sending identify payload");
                gatewayIdentify();
            }
            break;
        // Heartbeat ACK
        case 11:
            console.log('heartbeat ACK');
            break;
    }
}

function eventHandler(eventName, d){
    switch(eventName){
        case "READY":
            sessionId = d.session_id;

            setInterval(function(){
                console.log('sending heartbeat');
                socket.send(JSON.stringify({op: 1, d: s}));
            }, heartbeatInterval);
            break;
        case "RESUMED":
            break;
        case "MESSAGE_CREATE":
            messageHandler(d);
            break;
    }
}

function messageHandler(msg){
    console.log(msg);
    var command = msg.content.split('!');
    if(command[0].toLowerCase() != 'k'){
        return;
    }

    request.post({"url": "https://discordapp.com/api/channels/"+msg.channel_id+"/messages", "headers": AuthHeaders, json: {content: command[1]}});
}