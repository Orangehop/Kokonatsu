var Discord = require("discord.js");
var request = require('request');

var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = "k!";
    if(!msg.content.startsWith(prefix)) return;
    if(msg.author.bot) return;
    console.log(msg);
    if (msg.content.startsWith(prefix+"echo")) {
        var args = msg.content.substr(msg.content.indexOf(" ")+1);
        msg.channel.sendMessage(args);
    }
    else if(msg.content.startsWith(prefix+"gif"))
    {
        var args = msg.content.substr(msg.content.indexOf(" ")+1);
        var tags = args.split(" ").join("+");
        console.log(tags);
        request.get({"url": "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+tags}, function(err, res, body)
        {
            msg.channel.sendMessage(JSON.parse(body).data.url);
        });
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjI1NjQwMTg0MDgxODA5NDA4.CrxrOw.aKPI8pIeKgwiQJOM02A_cQiCEKQ");