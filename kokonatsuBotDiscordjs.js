// need to listen or heroku will close the app in 60s
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var Discord = require("discord.js");
var request = require('request');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://admin:password@ds047612.mlab.com:47612/kokonatsu';

var botCommands = require('./botCommands');
var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = "k!";
    if(!msg.content.startsWith(prefix)){ if(!msg.content.startsWith('`')) return;}
    if(msg.author.bot) return;
    console.log(msg.content);

    var tags = msg.content.substr(msg.content.indexOf(" ")+1).split(" ");

    if (msg.content.startsWith(prefix+"echo")) {
        botCommands.echo(msg);
    }
    else if(msg.content.startsWith(prefix+"gif")) {
        botCommands.gif(msg, tags, request);
    }
    else if(msg.content.startsWith(prefix+"macro")) {
        botCommands.macro(msg, tags, MongoClient, dbUrl);
    }
    else if(msg.content.startsWith('`') && msg.content.indexOf(" ") == -1){
        botCommands.quickMacro(msg, msg.content.substr(1), MongoClient, dbUrl);
    }
});


bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjI1NjQwMTg0MDgxODA5NDA4.CrxrOw.aKPI8pIeKgwiQJOM02A_cQiCEKQ");