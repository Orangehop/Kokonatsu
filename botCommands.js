var macro = function (msg, tags, macros) {
    let guildID = msg.channel.guild.id;
    console.log(tags);
    if (tags[0] == "add" && tags.length == 3) {
        tags[1] = tags[1].toLowerCase();
        macros.findOneAndUpdate({
            guild: guildID,
            macro: tags[1]
        }, {
            $set: {
                guild: guildID,
                macro: tags[1]
            },
            $push: {
                links: {$each: [tags[2]]}
            }
        }, {
            upsert: true,
            returnNewDocument: true
        }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.value);
                msg.channel.sendMessage("Inserted macro " + tags[1] + " " + tags[2]);
            }
        });
    }
    else if (tags[0] == "list") {
        macros.find({
            guild: guildID
        }).toArray(function (err, macroList) {
            console.log(macroList);

            msg.channel.sendMessage("view all the macros here: http://kokonatsu-macros.herokuapp.com/#/home");
        });
    }
    else if ((tags[0] == "delete" || tags[0] == "remove") && (tags.length == 2 || tags.length == 3)) {
        tags[1] = tags[1].toLowerCase();
        var searchText;
        macros.findOne({
            guild: guildID,
            macro: tags[1]
        }, function (err, macro) {
            if (macro){
                searchText = macro.links;
            }
            else {
                msg.channel.sendMessage(tags[1] + " doesn't exist");
                return;
            }

            if (searchText.length > 1) {
                if (!tags[2] || parseInt(tags[2]) == NaN) {
                    msg.channel.sendMessage("macro has more than one link, please specify which link to delete");
                    return;
                }

                if (parseInt(tags[2]) - 1 > macro.links.length) {
                    msg.channel.sendMessage(tags[1] + " " + tags[2] + ' does not exist');
                    return;
                }

                var linkToRemove = macro.links[parseInt(tags[2]) - 1];

                macros.findOneAndUpdate({
                        guild: guildID,
                        macro: tags[1]
                    }, {
                        $pull: {
                           links: linkToRemove
                        }
                    }, {
                  returnNewDocument: false
                },
                    function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(res);
                        let macro = res.value;
                        if (res.ok == 1 && macro) {
                            msg.channel.sendMessage("Deleted macro " + macro.macro + " " + linkToRemove);
                        }

                    });
            } else {
                macros.findOneAndDelete({
                        guild: guildID,
                        macro: tags[1]
                    },
                    function (err, res) {
                        let macro = res.value;
                        if (res.ok == 1 && macro) {
                            msg.channel.sendMessage("Deleted macro " + macro.macro + " " + macro.links[0]);
                        }

                    });
            }
        });
    }
};

var quickMacro = function (msg, macroName, tags, macros) {
    macroName = macroName.toLowerCase();
    var macroNumber;
    if(tags[0]){
        macroNumber = parseInt(tags[0]);
    }
    let guildID = msg.channel.guild.id;
    console.log(tags);

    macros.findOne({
        guild: guildID,
        macro: macroName
    }, function (err, macro) {
        console.log(macro);
        if (macro == null) {
            msg.channel.sendMessage(macroName + ' does not exist');
        } else {
            if (macroNumber && (macroNumber != NaN)) {
                console.log(macro);
                if (macroNumber <= macro.links.length) {
                    msg.channel.sendMessage(macro.links[macroNumber - 1]);
                    macros.findOneAndUpdate({_id: macro._id}, {$set:{usage: parseInt(macro.usage)+1}});
                } else {
                    msg.channel.sendMessage(tags[0] + " " + tags[1] + ' does not exist');
                }
            } else {
                console.log(macro)
                var randNumber = Math.floor(Math.random() * macro.links.length);
                msg.channel.sendMessage(macro.macro+" "+randNumber+"/"+macro.links.length+" "+macro.links[randNumber]);
                macros.findOneAndUpdate({_id: macro._id}, {$set:{usage: parseInt(macro.usage)+1}});
            }
        }
    });
}

var echo = function (msg) {
    var args = msg.content.substr(msg.content.indexOf(" ") + 1);
    msg.channel.sendMessage(args);
};

var gif = function (msg, tags, request) {
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