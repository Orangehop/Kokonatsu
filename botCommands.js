var macro = function(msg, tags, MongoClient, dbUrl){
    let guildID = msg.channel.guild.id;
    console.log(tags);
    if(tags[0] == "add" && tags.length == 3) {
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }
            else {
                console.log("connected to db");
                db.collection('Macros', function(err, macros){
                    macros.findOne({guild: {$eq: guildID}, macro: {$eq: tags[1]} }, function(err, macro){
                        if(macro){
                            msg.channel.sendMessage("Macro already exists");
                            db.close();
                        }
                        else{
                            macros.insertOne({guild: guildID, macro: tags[1], text: tags[2]}, function(err, res){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    msg.channel.sendMessage("Inserted macro "+tags[1]+" "+tags[2]);
                                }
                                db.close();
                            });
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
            }
            else {
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
};

var quickMacro = function(msg, tag, MongoClient, dbUrl){
    let guildID = msg.channel.guild.id;
    console.log(tag);

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            db.collection('Macros', function(err, macros){
                macros.findOne({guild: {$eq: guildID}, macro: {$eq: tag} }, function(err, macro){
                    if(macro == null){
                        msg.channel.sendMessage(tag+' does not exist');
                    }
                    else{
                        msg.channel.sendMessage(macro.text);
                    }
                    db.close();
                });
            });
        }
    });
}

var echo = function(msg){
    var args = msg.content.substr(msg.content.indexOf(" ")+1);
    msg.channel.sendMessage(args);
};

var gif = function(msg, tags, request){
    console.log(tags);
    request.get({"url": "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+tags}, function(err, res, body) {
        msg.channel.sendMessage(JSON.parse(body).data.url);
    });
};

module.exports.macro = macro;
module.exports.quickMacro = quickMacro;
module.exports.echo = echo;