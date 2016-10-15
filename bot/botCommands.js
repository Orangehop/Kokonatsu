var request = require('request');

var mongoose = require('mongoose');
var Macro = mongoose.model('macro');
var User = mongoose.model('user');

var helpMsgs = require('./helpMessages');

var config = function (msg, command, tags) {
    console.log(tags);
    console.log(command);
    let guildID = msg.channel.guild.id;
    var tagLength = tags.length

    if (command == "add"){
        if(!validTags(tags, ["string", "string", 2, 2])) return;

        var name = tags[0].toLowerCase();
        var link = tags[1];

        Macro.find({name: name, guild: guildID}).
        then(function(macros){
            var number = 1;
            if(macros.length > 0) number = macros.length + 1;
            Macro.create({
                name: name,
                guild: guildID,
                number: number,
                link: link,
                score: 0,
                usage: 0,
            }).
            then(function(newMacro){
                msg.channel.sendMessage(name+" "+number+"\n"+link);
            });
        });
    }

    else if (command == "list") {
        if(!validTags(tags, [], 0, 0)) return;
        msg.channel.sendMessage("view all the macros here: http://kokonatsu.herokuapp.com");
    }

    else if (command == "rename"){
        if(!validTags(tags, ["string", "string"], 2, 2)) return false;

        var name = tags[0].toLowerCase();
        var newName = tags[1].toLowerCase();
        Macro.find({
            guild: guildID,
            name: newName,
        }).
        then(function(macros){
            return new Promise(function(resolve, reject){
                if(macros.length > 0) resolve(true);
                else resolve(false);
            });
        }).
        then(function(exists){
            if(exists) msg.channel.sendMessage(":x: \'" + newName+ "\' already exists!");
            else{
                Macro.find({
                    guild: guildID,
                    name: name,
                }).
                then(function(macros){
                    macros.forEach(function(macro){
                        macro.name = newName;
                        macro.save();
                    });

                    msg.channel.sendMessage(":ok_hand: Macro \'" + name + "\' has been renamed to \'" + newName+"\'!");
                });
            }
        });
    }

    else if (command == "top") {
        if(!validTags(tags, ["string", "int"], 1, 2)) return;

        var sortKey = tags[0];
        var sortOption = {};
        var type = "";
        var column = "";
        if(sortKey == "usage"){
            sortOption.usage = -1;
            type = "Used";
            column = "Usage:"
        }
        else if(sortKey == "score"){
            sortOption.score = -1;
            type = "Scoring";
            column = "Score:"
        }
        else{
            msg.channel.sendMessage("Set a proper top type b-b-b-baka!!!!!!");
            return;
        }

        var limitNumber;
        if(tags.length > 1) limitNumber = parseInt(tags[1]);
        else limitNumber = 10;

        Macro.find({guild: guildID}).sort(sortOption).limit(limitNumber).exec().
        then(function(macros){
            let resultString = "";
            macros.forEach(function(macro){
                var result;
                if(sortKey == "usage") result = macro.usage;
                else if(sortKey == "score") result = macro.score;
                resultString += macro.name+ "(" + macro.number + ")" + ("                          " + result).slice(macro.name.length) + "\n";
            });
            msg.channel.sendMessage("The Top "+limitNumber+" "+type+" Macros!\n" +
                    "```Name:\t\t\t\t\t"+column+"\n" + resultString + "```");
        });
    }

    else if (command == "usage") {
        if(!validTags(tags, ["string", "int"], 1, 2)) return;

        var name = tags[0];
        var searchOptions = {guild: guildID, name: name};
        if(tags.length > 1) searchOptions.number = tags[1];
        Macro.find(searchOptions).
        then(function(macros){
            if(macros.length == 0) return msg.channel.sendMessage("Enter a proper macro name, you fucking dumb piece of shit. Oops, I mean you baka!");

            var totalUsage = 0;
            macros.forEach(function(macro){
                totalUsage += macro.usage;
            });

            var response = ":heart: The macro \'" + name;
            if(tags.length > 1) response += (" ("+tags[1]+")");
            response += " has been used "+totalUsage+" times! :heart:";

            msg.channel.sendMessage(response);
        });
    }

    else if (command == "score") {
        if(!validTags(tags, ["string", "int"], 1, 2)) return;

        var name = tags[0];
        var searchOptions = {guild: guildID, name: name};
        if(tags.length > 1) searchOptions.number = tags[1];
        Macro.find(searchOptions).
        then(function(macros){
            if(macros.length == 0) return msg.channel.sendMessage("Enter a proper macro name, you fucking dumb piece of shit. Oops, I mean you baka!");

            var totalScore = 0;
            macros.forEach(function(macro){
                totalScore += macro.score;
            });

            var response = ":heart: The macro \'" + name;
            if(tags.length > 1) response += (" ("+tags[1]+")");
            response += " has a score of  "+totalScore+"! :heart:";

            msg.channel.sendMessage(response);
        });
    }

    else if (command == "delete" || command == "remove"){
        if(!validTags(tags, ["string", "int"], 1, 2)) return;

        var name = tags[0].toLowerCase();
        var macroNumber;
        if(tags.length > 1) macroNumber = parseInt(tags[1]);
        else macroNumber = 1;

        Macro.find({guild: guildID, name: name}).
        then(function(macros){
            if(macros.length < macroNumber){
                msg.channel.sendMessage(name + " " + macroNumber + ' does not exist');
                return;
            }
            macros.forEach(function(macro){
                if(macro.number == macroNumber){
                    macro.remove().
                    then(function(deletedMacro){
                        msg.channel.sendMessage(deletedMacro.name+" "+deletedMacro.number+" has been deleted\n"+deletedMacro.link);
                    });
                }
                else if(macro.number > macroNumber){
                    macro.number = macro.number - 1;
                    macro.save();
                }
            });
        });
    }

    else if(command == "vote"){
        if(!validTags(tags, ["string", "string", "int"], 3, 3)) return;

        var modifier = tags[0];
        var name = tags[1];
        var number = tags[2];
        var change = 0;
        var author = msg.author;
        var dbUser;

        User.findOneAndUpdate({discordId: author.id},
                                              {username: author.username,
                                                discriminator: author.discriminator,
                                                avatar: author.avatar},
                                              {upsert: true,
                                                new: true}).
        then(function(user){
            dbUser = user;
            return Macro.findOne({name: name, number: number, guild: guildID})
        }).
        then(function(macro){
            if(modifier == "up"){
                if(dbUser.likes.indexOf(macro.id) != -1){
                    msg.channel.sendMessage("You've already liked this post");
                    return;
                }

                if(dbUser.dislikes.indexOf(macro.id) != -1){
                    dbUser.dislikes.splice(dbUser.dislikes.indexOf(macro.id), 1);
                    change += 1;
                }

                dbUser.likes.push(macro._id);
                dbUser.save();
                change += 1;
            }
            else if(modifier == "down"){
                if(dbUser.dislikes.indexOf(macro.id) != -1){
                    msg.channel.sendMessage("You've already disliked this post");
                    return;
                }

                if(dbUser.likes.indexOf(macro.id) != -1){
                    dbUser.likes.splice(dbUser.likes.indexOf(macro.id), 1);
                    change -= 1;
                }

                dbUser.dislikes.push(macro._id);
                dbUser.save();
                change -= 1;
            }

            macro.score += change;
            macro.save();
            msg.channel.sendMessage(macro.name+" score has been updated to "+ macro.score);
        });
    }

    else if (command == "help"){
        if(typeof(tags[0]) == "undefined") return msg.channel.sendMessage(helpMsgs.quickHelp);

        if(tags[0] == "config"){
            if(typeof(tags[1]) == "undefined") return msg.channel.sendMessage(helpMsgs.configHelp);
        }
    }
};

var macro = function (msg, name, number){
    let guildID = msg.channel.guild.id;

    Macro.find({guild: guildID, name: name}).sort({number: 1}).
    then(function(macros){
        if(macros.length == 0) return msg.channel.sendMessage(name+' does not exist');

        var message="";
        if(typeof(number) == "undefined"){
            number = Math.floor(Math.random() * macros.length);
            message = (number+1)+"/"+macros.length+"\n";
        }
        else{
            if(isNaN(parseInt(number))) return;
            number = parseInt(number) - 1;
        }

        if(number  < 0 || number >= macros.length) return msg.channel.sendMessage(name+' '+(number+1)+' does not exist');
        msg.channel.sendMessage(message+macros[number].link);
        macros[number].usage = macros[number].usage + 1;
        macros[number].save();
    });
}

// helper method to check if tags are valid
var validTags = function(tags, types, minLength, maxLength){
    if(tags.length < minLength || tags.length > maxLength) return false;
    var valid = true;
    tags.forEach(function(tag, index){
        if(types[index] == "string"){
            if(typeof(tag) != "string") valid = false;
        }
        else if(types[index] == "int"){
            if(isNaN(parseInt(tag))){valid = false};
        }
    });
    return valid;
}

module.exports.macro = macro;
module.exports.config = config;