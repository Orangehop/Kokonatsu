var request = require('request');

var mongoose = require('mongoose');
var Macro = mongoose.model('TestMacro');

var macro = function (msg, tags) {
    let guildID = msg.channel.guild.id;
    var command = tags[0];
    var tagLength = tags.length
    if (command == "add" && tagLength == 3) {
        var name = tags[1].toLowerCase();
        var link = tags[2];

        Macro.find({name: name, guild: guildID}).
        then(function(macros){
            var number;
            if(macros.length > 0) number = macros.length;
            else number = 0;
            Macro.create({
                name: name,
                guild: guildID,
                number: number,
                link: link,
                voters: [],
                score: 0,
                usage: 0,
                favorites: 0
            }).
            then(function(newMacro){
                msg.channel.sendMessage(name+" "+(number+1)+"\n"+link);
            });
        });
    }
    // add back list command when website is done
    // else if (tags[0] == "list") {
    //     msg.channel.sendMessage("view all the macros here: http://kokonatsu.herokuapp.com");
    // }
    else if (tags[0] == "rename" && tagLength == 3) {
        var name = tags[1].toLowerCase();
        var newName = tags[2];
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
        var limitNumber;
        if(tags[1] && parseInt(tags[1]) !== NaN) limitNumber = parseInt(tags[1]);
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
    // else if (tags[0] == "usage" && tags[1] != null) {
    //     macros.findOne({guild: guildID, macro: tags[1]}, function (err, macro) {
    //         if (macro) {
    //             msg.channel.sendMessage(":heart: The macro \'" + tags[1] + "\' has been used " + macro.usage + " times! :heart:");
    //         } else {
    //             msg.channel.sendMessage("Enter a proper macro name, you fucking dumb piece of shit. Oops, I mean you baka!");
    //         }
    //     });
    // }
    // else if ((tags[0] == "delete" || tags[0] == "remove") && (tags.length == 2 || tags.length == 3)) {
    //     tags[1] = tags[1].toLowerCase();
    //     var searchText;
    //     macros.findOne({
    //         guild: guildID,
    //         macro: tags[1]
    //     }, function (err, macro) {
    //         if (macro){
    //             searchText = macro.links;
    //         }
    //         else {
    //             msg.channel.sendMessage(tags[1] + " doesn't exist");
    //             return;
    //         }

    //         if (searchText.length > 1) {
    //             if (!tags[2] || parseInt(tags[2]) == NaN) {
    //                 msg.channel.sendMessage("macro has more than one link, please specify which link to delete");
    //                 return;
    //             }

    //             if (parseInt(tags[2]) - 1 > macro.links.length) {
    //                 msg.channel.sendMessage(tags[1] + " " + tags[2] + ' does not exist');
    //                 return;
    //             }

    //             var linkToRemove = macro.links[parseInt(tags[2]) - 1];

    //             macros.findOneAndUpdate({
    //                     guild: guildID,
    //                     macro: tags[1]
    //                 }, {
    //                     $pull: {
    //                        links: linkToRemove
    //                     }
    //                 }, {
    //               returnNewDocument: false
    //             },
    //                 function (err, res) {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 console.log(res);
    //                     let macro = res.value;
    //                     if (res.ok == 1 && macro) {
    //                         msg.channel.sendMessage("Deleted macro " + macro.macro + " " + linkToRemove);
    //                     }

    //                 });
    //         } else {
    //             macros.findOneAndDelete({
    //                     guild: guildID,
    //                     macro: tags[1]
    //                 },
    //                 function (err, res) {
    //                     let macro = res.value;
    //                     if (res.ok == 1 && macro) {
    //                         msg.channel.sendMessage("Deleted macro " + macro.macro + " " + macro.links[0]);
    //                     }

    //                 });
    //         }
    //     });
    // }
};

// var quickMacro = function (msg, macroName, tags) {
//     macroName = macroName.toLowerCase();
//     var macroNumber;
//     if(tags[0]){
//         macroNumber = parseInt(tags[0]);
//     }
//     let guildID = msg.channel.guild.id;
//     console.log(tags);

//     macros.findOne({
//         guild: guildID,
//         macro: macroName
//     }, function (err, macro) {
//         console.log(macro);
//         if (macro == null) {
//             msg.channel.sendMessage(macroName + ' does not exist');
//         } else {
//             if (macroNumber && (macroNumber != NaN)) {
//                 console.log(macro);
//                 if (macroNumber <= macro.links.length) {
//                     msg.channel.sendMessage(macro.links[macroNumber - 1]);
//                     macros.findOneAndUpdate({_id: macro._id}, {$set:{usage: parseInt(macro.usage)+1}});
//                 } else {
//                     msg.channel.sendMessage(tags[0] + " " + tags[1] + ' does not exist');
//                 }
//             } else {
//                 console.log(macro)
//                 var randNumber = Math.floor(Math.random() * macro.links.length);
//                 msg.channel.sendMessage((randNumber + 1)+"/"+macro.links.length+" "+macro.links[randNumber]);
//                 macros.findOneAndUpdate({_id: macro._id}, {$set:{usage: parseInt(macro.usage)+1}});
//             }
//         }
//     });
// }

// var echo = function (msg) {
//     var args = msg.content.substr(msg.content.indexOf(" ") + 1);
//     msg.channel.sendMessage(args);
// };

// var gif = function (msg, tags) {
//     console.log(tags);
//     request.get({
//         "url": "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + tags
//     }, function (err, res, body) {
//         msg.channel.sendMessage(JSON.parse(body).data.url);
//     });
// };

// var help = function (msg, tags){
//     console.log(tags);
//     if (tags.length != 1) return;
//     var HelpCommands = {macro: 0};
//     var helpNo = HelpCommands[tags[0]];
//     HelpMessage = [
// "Kokonatsu Help Menu \n\n\
// Macro: __Outputs a link when a recorded macro is typed__ \n\n\
// Config Usage: k!macro add <macroName> <link> | delete <macroName> <macroNumber> | list \n\
// Output Usage: k!<macroName> <optional macroNumber> \n\n\
// Examples: \n\
// `k!macro add clap http://i.imgur.com/ezHbFKc.gif` adds the link to the macro clap \n\
// `k!clap #` outputs the macro's link. If no # is specified then a random link from the macro will be played \n\
// `k!macro delete clap #` deletes link number # from the macro. If the macro has only one link than the entire macro is deleted"
// ];
//     console.log(HelpMessage[helpNo]);
//     msg.channel.sendMessage(HelpMessage[helpNo]);
// }

module.exports.macro = macro;
// module.exports.quickMacro = quickMacro;
// module.exports.echo = echo;
// module.exports.gif = gif;
// module.exports.help = help;