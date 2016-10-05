var Discord = require("discord.js");

var botCommands = require('./botCommands');
var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = process.env.PREFIX;
    var command;
    if(!(msg.content.startsWith(prefix.toLowerCase()) || msg.content.startsWith(prefix.toUpperCase())) || msg.author.bot || msg.content.length <= prefix.length) return;
    else command = msg.content.split("!")[1].split(" ")[0];
    console.log(msg.content);

    var tags = msg.content.split(" ");
    tags.shift();

    if (command == "echo") {
        botCommands.echo(msg);
    }
    else if(command == "gif") {
        botCommands.gif(msg, tags);
    }
    else if(command == "macro") {
        botCommands.macro(msg, tags);
    }
    else if(command == "help"){
        botCommands.help(msg, tags);
    }
    else{
        botCommands.quickMacro(msg, command, tags);
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(process.env.BOTTOKEN);