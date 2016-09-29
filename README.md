# Kokonatsu
Kokonatsu is a Discord Chat bot that creates macros so that users can quickly reply back with a link to an img or gif.
This encourages server interaction as reaction imgs and gifs can quickly be sent back and forth to each other. The macros that all the users
have created can then be viewed on the site [kokonatsu-macro](http://kokonatsu-macros.herokuapp.com/#/home). For more information about the site please see the repo [Kokonatsu-MacroSite](https://github.com/smwoo/Kokonatsu-MacroSite)

## Usage
All commands to the bot must begin with \<k!>  
The available commands for the bot are add, delete, rename, list, usage, top  
  
Add is used with the command k!macro add \<macro name> \<macro link>  
In the even that a macro is added with the same name they are combined together and when called, one of the links will be outputted randomly
  
Delete is used with the command k!macro delete \<macro name> optional=\<macro number>  
If a macro contains multiple links then the number that it appears in the macro must be given to specify which one to delete  
  
Rename is used with the command k!macro rename \<macro name> \<new macro name>  
It allows you to rename a macro to a new macro name  
  
List is used with the command k!macro list
The bot responds to this command by providing a link to the macro site which can be used to view all the macros in a server
  
Usage is used with the command k!macro usage \<macro name>
The bot responds to this command with the number of times that the macro has been used in this server
  
Top is used with the command k!macro top optional=\<number; default=15>
The bot responds to this command with a list of the most used macros in the server
  
Macros are called by using the command k!\<macro name>
