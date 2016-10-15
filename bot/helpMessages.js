var quickHelp = "To send a macro simply type k!\<macro name>\n"+
                            "For more options type 'k@help config'";

var configHelp = "```== COMMANDS LIST ==```\n"+
                             "**add** `\<macro name> \<macro link>` - add a new macro\n"+
                             "**delete** | **remove** `\<macro name> <macro number, default = 1>` - delete/remove a macro\n"+
                             "**list** - gives link to kokonatsu macro site\n"+
                             "**rename** `\<macro name> \<new macro name>` - renames all of one macro to another\n"+
                             "**top** `\<type, number, default = 10>` - set type to either 'score' or 'usage' to get the top scored or used macros\n"+
                             "**usage** `\<macro name> \<macro number, optional>` - determine how often a macro has been used. Gets the usage of all named macros if no number given\n"+
                             "**score** `\<macro name> \<macro number, optional>` - returns the score of a macro. if no number is given then return net macro score\n";

module.exports.quickHelp = quickHelp;
module.exports.configHelp = configHelp;