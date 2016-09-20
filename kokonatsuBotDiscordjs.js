var Discord = require("discord.js");
var request = require('request');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://admin:password@ds047612.mlab.com:47612/kokonatsu';

var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = "k!";
    if(!msg.content.startsWith(prefix)) return;
    if(msg.author.bot) return;
    // console.log(msg);
    if (msg.content.startsWith(prefix+"echo")) {
        var args = msg.content.substr(msg.content.indexOf(" ")+1);
        msg.channel.sendMessage(args);
    }
    else if(msg.content.startsWith(prefix+"gif")) {
        var args = msg.content.substr(msg.content.indexOf(" ")+1);
        var tags = args.split(" ").join("+");
        console.log(tags);
        request.get({"url": "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+tags}, function(err, res, body) {
            msg.channel.sendMessage(JSON.parse(body).data.url);
        });
    }
    else if(msg.content.startsWith(prefix+"macro")) {
        let guildID = msg.channel.guild.id;
        var args = msg.content.substr(msg.content.indexOf(" ")+1);
        var tags = args.split(" ");
        console.log(tags);
        if(tags[0] == "add" && tags.length == 3) {
            MongoClient.connect(dbUrl, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    console.log("connected to db");
                    db.collection('Macros', function(err, macros){
                        macros.findOne({guild: {$eq: guildID}, macro: {$eq: tags[1]} }, function(err, macro){
                            if(macro){
                                msg.channel.sendMessage("Macro already exists");
                                db.close();
                            }
                            else{
                                macros.insertOne({guild: guildID, macro: tags[1], text: tags[2]}, function(err, res){
                                    console.log(err);
                                    console.log(res);
                                    db.close();
                                });
                                msg.channel.sendMessage("Inserted macro "+tags[1]+" "+tags[2]);
                            }
                        });
                    });
                }
            });
        }
        else if(tags[0] == "list") {
            MongoClient.connect(dbUrl, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    console.log("connected to db");
                    db.collection('Macros', function(err, macros){
                        macros.find({guild: {$eq: guildID}}).toArray(function(err, macroList){
                            console.log(macroList);

                            msg.channel.sendMessage("Feature not Implemented, check console log");

                            db.close();
                        });
                    });
                }
            });
        }
        else if(tags[0] == "delete" && tags.length == 2) {
            MongoClient.connect(dbUrl, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    db.collection('Macros', function(err, macros){
                        macros.findOneAndDelete({guild: {$eq: guildID}, macro: {$eq: tags[1]} }, function(err, res){
                            let macro = res.value;
                            if(res.ok == 1 && macro){
                                msg.channel.sendMessage("Deleted macro "+macro.macro+" "+macro.text);
                            }

                            db.close();
                        });
                    });
                }
            });
        }
        else if(tags.length == 1) {
            MongoClient.connect(dbUrl, function (err, db) {
                if (err) {
                    console.log('Unable to connect to the mongoDB server. Error:', err);
                } else {
                    db.collection('Macros', function(err, macros){
                        macros.findOne({guild: {$eq: guildID}, macro: {$eq: tags[0]} }, function(err, macro){
                            msg.channel.sendMessage(macro.text);

                            db.close();
                        });
                    });
                }
            });
        }
    }
});


bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjI1NjQwMTg0MDgxODA5NDA4.CrxrOw.aKPI8pIeKgwiQJOM02A_cQiCEKQ");