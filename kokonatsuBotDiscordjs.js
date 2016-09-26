// need to listen or heroku will close the app in 60s
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

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


bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(process.env.BOTTOKEN);