var request = require('request');

var mongoose = require('mongoose');
var Macro = mongoose.model('TestMacro');

var macro = function (msg, tags) {
    let guildID = msg.channel.guild.id;
    var command = tags[0];
    var tagLength = tags.length
    if (command == "add"){
        if(!validTags(tags.slice(1), ["string", "string", 2, 2])) return;

        var name = tags[1].toLowerCase();
        var link = tags[2];

        Macro.find({name: name, guild: guildID}).
        then(function(macros){
            var number = 0;
            if(macros.length > 0) number = macros.length;
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
    else if (tags[0] == "list") {
        if(!validTags(tags.slice(1), [], 0, 0)) return;
        msg.channel.sendMessage("view all the macros here: http://kokonatsu.herokuapp.com");
    }
    else if (tags[0] == "rename"){
        if(!validTags(tags.slice(1), ["string", "string"], 2, 2)) return false;

        var name = tags[1].toLowerCase();
        var newName = tags[2].toLowerCase();
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

                    msg.channel.sendMessage(":ok_hand: Macro \'" + tags[1] + "\' has been renamed to \'" + tags[2]+"\'!");
                });
            }
        });
    }
    else if (command == "top") {
        if(!validTags(tags.slice(1), ["int"], 0, 1)) return;

        var limitNumber;
        if(tags.length > 1) limitNumber = parseInt(tags[1]);
        else limitNumber = 10;

        Macro.find({guild: guildID}).sort({score: -1}).limit(limitNumber).exec().
        then(function(macros){
            let resultString = "";
            macros.forEach(function(macro){
                resultString += macro.name + ("                          " + macro.score).slice(macro.name.length) + "\n";
            });
            msg.channel.sendMessage("The Top " + limitNumber + " Used Macros!\n" +
                    "```Name:\t\t\t\t\tScore:\n" + resultString + "```");
        });
    }
    // else if (command == "usage" && tagLength == 2) {
    //     var name = tags[1];
    //     macros.findOne({guild: guildID, macro: name}, function (err, macro) {
    //         if (macro) {
    //             msg.channel.sendMessage(":heart: The macro \'" + tags[1] + "\' has been used " + macro.usage + " times! :heart:");
    //         } else {
    //             msg.channel.sendMessage("Enter a proper macro name, you fucking dumb piece of shit. Oops, I mean you baka!");
    //         }
    //     });
    // }
    else if (tags[0] == "delete" || tags[0] == "remove"){
        if(!validTags(tags.slice(1), ["string", "int"], 1, 2)) return;

        var name = tags[1].toLowerCase();
        var macroNumber;
        if(tags.length > 2) macroNumber = parseInt(tags[2]);
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
};

var quickMacro = function (msg, name, tags) {
    if(!validTags(tags, ["int"], 0, 1)) return;

    let guildID = msg.channel.guild.id;

    Macro.find({guild: guildID, name: name}).sort({number: 1}).
    then(function(macros){
        if(macros.length == 0) return msg.channel.sendMessage(name+' does not exist');

        var message="";

        var macroNumber;
        if(tags.length > 0) macroNumber = parseInt(tags[0]);
        else{
            macroNumber = Math.floor(Math.random() * macros.length);
            message = macroNumber+"/"+macros.length+"\n";
        }

        if(macroNumber  < 0 || macroNumber > macros.length) return msg.channel.sendMessage(name+' '+macroNumber+' does not exist');
        macroNumber--;
        msg.channel.sendMessage(message+macros[macroNumber].link);
        macros[macroNumber].usage = macros[macroNumber].usage + 1;
        macros[macroNumber].save();
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

var echo = function (msg) {
    var args = msg.content.substr(msg.content.indexOf(" ") + 1);
    msg.channel.sendMessage(args);
};

var gif = function (msg, tags) {
    console.log(tags);
    request.get({
        "url": "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + tags
    }, function (err, res, body) {
        msg.channel.sendMessage(JSON.parse(body).data.url);
    });
};

var help = function (msg, tags){
    console.log(tags);
    if (tags.length != 1) return;
    var HelpCommands = {macro: 0};
    var helpNo = HelpCommands[tags[0]];
    HelpMessage = [
"Kokonatsu Help Menu \n\n\
Macro: __Outputs a link when a recorded macro is typed__ \n\n\
Config Usage: k!macro add <macroName> <link> | delete <macroName> <macroNumber> | list \n\
Output Usage: k!<macroName> <optional macroNumber> \n\n\
Examples: \n\
`k!macro add clap http://i.imgur.com/ezHbFKc.gif` adds the link to the macro clap \n\
`k!clap #` outputs the macro's link. If no # is specified then a random link from the macro will be played \n\
`k!macro delete clap #` deletes link number # from the macro. If the macro has only one link than the entire macro is deleted"
];
    console.log(HelpMessage[helpNo]);
    msg.channel.sendMessage(HelpMessage[helpNo]);
}

module.exports.macro = macro;
module.exports.quickMacro = quickMacro;
module.exports.echo = echo;
module.exports.gif = gif;
module.exports.help = help;