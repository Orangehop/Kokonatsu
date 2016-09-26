// need to listen or heroku will close the app in 60s
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var AuthHeaders = {"User-Agent" : "Kokonatsu (http://test.com, v0.1)", "Authorization" : "Bot "+process.env.BOTTOKEN};

var Discord = require("discord.js");
var request = require('request');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = process.env.KOKONATSUDB;
var macrosConnected = MongoClient.connect(dbUrl).then(function(db){
    return db.collection('Macros');
});

var botCommands = require('./botCommands');
var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = process.env.PREFIX;
    var command;
    msg.content = msg.content.toLowerCase();
    if(!msg.content.startsWith(prefix) || msg.author.bot || msg.content.length <= prefix.length) return;
    else command = msg.content.split("!")[1].split(" ")[0];
    console.log(msg.content);
    console.log(command);


    var tags = msg.content.split(" ");
    tags.shift();
    console.log(tags);

    if (command == "echo") {
        botCommands.echo(msg);
    }
    else if(command == "gif") {
        botCommands.gif(msg, tags, request);
    }
    else if(command == "macro") {
        macrosConnected.then(function(macros){
            botCommands.macro(msg, tags, macros);
        });
    }
    else if(command == "help"){
        botCommands.help(msg, tags);
    }
    else{
        macrosConnected.then(function(macros){
            botCommands.quickMacro(msg, command, tags, macros);
        });
    }
});

app.post('/github', function (req, res) {
    res.send('Received github payload');
    if(req.get("X-GitHub-Event") != "push"){
        return;
    }
    var payload = req.body;
    var repo = payload.repository.name;
    payload.commits.forEach(function(commit){
        var author = commit.author.name;
        var msg = commit.message;
        var url = commit.url;
        var reply = "<@225637499953741836>"+author+" has pushed a commit to "+repo+"\n`"+msg+"`\nview it here: "+url;
        request.post({"url": "https://discordapp.com/api/channels/"+process.env.DEVCHANNELID+"/messages", "headers": AuthHeaders, json: {content: reply}});
    });
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(process.env.BOTTOKEN);