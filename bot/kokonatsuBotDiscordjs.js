var Discord = require("discord.js");

var botCommands = require('./botCommands');
var bot = new Discord.Client();

bot.on("message", msg => {
    var prefix = checkPrefix(msg.content);
    if(prefix == -1) return;
    else if(prefix == 1){
        console.log(msg.content);
        var command = msg.content.split("@")[1].split(" ")[0];
        var tags = msg.content.split(" ").slice(1);
        botCommands.config(msg, command, tags);
    }
    else if(prefix == 2){
        console.log(msg.content);
        var name = msg.content.split("!")[1].split(" ")[0];
        var number = msg.content.split(" ").slice(1)[0];
        botCommands.macro(msg, name, number);
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('disconnect', () => {
    bot.login(process.env.BOTTOKEN);
});

bot.login(process.env.BOTTOKEN);

var checkPrefix = function(msg){
    var macroPrefix = process.env.MACROPREFIX;
    var configPrefix = process.env.CONFIGPREFIX;
    var prefix = msg.slice(0, macroPrefix.length).toLowerCase();
    if(prefix == macroPrefix) return 2
    else if(prefix == configPrefix) return 1;
    else return -1;
}
