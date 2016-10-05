var quickHelp = "To send a macro simply type k!\<macro name>\n"+
                            "For more options type 'k@help config'";

var configHelp = "```== COMMANDS LIST ==```\n"+
                             "**add** `\<macro name> \<macro link>` - add a new macro\n"+
                             "**delete** | **remove** `\<macro name> <macro number, default = 0>` - delete/remove a macro\n"+
                             "**list** - gives link to kokonatsu macro site\n"+
                             "**rename** `\<macro name> \<new macro name>` - renames all of one macro to another\n"+
                             "**top** `\<number, default = 10>` - retrieves the top macros based on score\n";

module.exports.quickHelp = quickHelp;
module.exports.configHelp = configHelp;