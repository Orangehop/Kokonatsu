var macro = function (msg, tags, MongoClient, dbUrl) {
    tags[1].toLowerCase;
    let guildID = msg.channel.guild.id;
    console.log(tags);
    if (tags[0] == "add" && tags.length == 3) {
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log("connected to db");
                db.collection('Macros', function (err, macros) {
                        if (err) {
                            console.log(err);
                        }
                        macros.findOneAndUpdate({
                            guild: {
                                $eq: guildID
                            },
                            macro: {
                                $eq: tags[1]
                            }
                        }, {
                            $set: {
                                guild: guildID,
                                macro: tags[1]
                            },
                            $addToSet: {
                                text: tags[2]
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
                                db.close();
                            }
                        })
                    }
                )

            }
        });
    } else if (tags[0] == "list") {
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                console.log("connected to db");
                db.collection('Macros', function (err, macros) {
                    macros.find({
                        guild: {
                            $eq: guildID
                        }
                    }).toArray(function (err, macroList) {
                        console.log(macroList);

                        msg.channel.sendMessage("Feature not Implemented, check console log");

                        db.close();
                    });
                });
            }
        });
    } else
    if ((tags[0] == "delete" || tags[0] == "remove") && (tags.length == 2 || tags.length == 3)) {
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var searchText = [];

                db.collection('Macros', function (err, macros) {



                    macros.findOne({
                        guild: {
                            $eq: guildID
                        },
                        macro: {
                            $eq: tags[1]
                        }
                    }, function (err, macro) {
                        if (macro){
                            searchText = macro.text;
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


                            if (parseInt(tags[2]) - 1 > macro.text.length) {
                                msg.channel.sendMessage(tags[1] + " " + tags[2] + ' does not exist');
                            }
                        
                            
                            macros.findOneAndUpdate({
                                    guild: {
                                        $eq: guildID
                                    },
                                    macro: {
                                        $eq: tags[1]
                                    }
                                }, {
                                    $pull: {
                                       text: linkToRemove
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
                                        msg.channel.sendMessage("Deleted macro " + macro.macro + " " + macro.text[parseInt(tags[2])]);
                                        db.close();
                                    }

                                });
                        } else {
                            macros.findOneAndDelete({
                                    guild: {
                                        $eq: guildID
                                    },
                                    macro: {
                                        $eq: tags[1]
                                    }
                                },
                                function (err, res) {
                                    let macro = res.value;
                                    if (res.ok == 1 && macro) {
                                        msg.channel.sendMessage("Deleted macro " + macro.macro + " " + macro.text[0]);
                                        db.close();
                                    }

                                });
                        }
                    });
                });
            }
        });
        
    }
};

var quickMacro = function (msg, tag, MongoClient, dbUrl) {
    tag[0].toLowerCase;
    let guildID = msg.channel.guild.id;
    console.log(tag);

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            db.collection('Macros', function (err, macros) {
                macros.findOne({
                    guild: {
                        $eq: guildID
                    },
                    macro: {
                        $eq: tag[0]
                    }
                }, function (err, macro) {
                    if (macro == null) {
                        msg.channel.sendMessage(tag[0] + ' does not exist');
                    } else {
                        console.log("tag1:" + tag[1]);
                        if (tag[1] && (parseInt(tag[1]) != NaN)) {
                            if (parseInt(tag[1]) - 1 < macro.text.length) {
                                msg.channel.sendMessage(macro.text[parseInt(tag[1]) - 1]);
                            } else {
                                msg.channel.sendMessage(tag[0] + " " + tag[1] + ' does not exist');
                            }
                        } else {
                            console.log(macro)
                            msg.channel.sendMessage(macro.text[Math.floor(Math.random() * macro.text.length)]);
                        }
                    }
                    db.close();
                });
            });
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

module.exports.macro = macro;
module.exports.quickMacro = quickMacro;
module.exports.echo = echo;
module.exports.gif = gif;