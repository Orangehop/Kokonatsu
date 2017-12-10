# Kokonatsu
Kokonatsu is a Discord Chat Bot that manages macros within a guild. By linking macros with images and gifs servers now have a tool to easily respond to messages with a reaction image or gif. This gives users another tool in which to interact with each other, increasing guild interaction. These macros are easily managed on the site http://kokonatsu.herokuapp.com.

An example of macros in action in a different community would be the r/anime subreddit with their [comment faces](https://www.reddit.com/r/anime/wiki/commentfaces).

With tools to allow easy lookup of a guild's macros and gauge the interest from users of different macros, Kokonatsu will be a fun addition to any guild.

## ToDo
1. Add a favorites button
2. Create a user page to track all liked, disliked, favorited macros
3. Add a statistics page to view info on macros for guild management
4. Create a guild settings option to restrict some commands and access to some views on the site

## Usage
Kokonatsu stores macros with 3 basic fields, the name of the macro, the number of the macro and the link that the bot responds to the macro with. Macros do not need to have a unique name, instead macros with identical names are then specified by their number. Numbers are assigned to macros according to the order in which they are added.

Commands to Kokonatsu are triggered with the keyphrase "k!" or "k@". k! is used to trigger a macro while k@ is used to access the configuration commands.


To send a macro simply type k!\<macro name> \<optional number>
If a number is given it will respond with that specific macro, however if no number is given then a random macro from the macros with the same name will be chosen.

Below are the different config commands than you can trigger.

Command | Description
--- | --- 
add \<macro name> \<macro link> | Adds a macro with the corresponding name and link. The macro number is automatically set to the number in which this macro was added, i.e if its the first of its kind it will have a number of 1
delete or remove <macro name> <macro number, default = 1> | Removes the specified macro. If no number is given then it automatically removes the first macro. Upon removal the other macros with the same name will adjust their numbers accordingly.
list | returns the link http://kokonatsu.herokuapp.com
rename \<macro name> \<new macro name> | renames all the macros with the specified name to a new name. The new name must be a unique name
top \<type = score, usage> \<number, default = 10> | Returns either the top scoring or most used macros
bottom \<type = score, usage> \<number, default = 10> | Returns either the bottom scoring or least used macros
usage \<macro name> \<macro number, optional> | returns the amount of times a macro has been used. If no number is specified then it returns the number of times every macro of that name has been used
score \<macro name> \<macro number, optional> | returns the score of a macro. If no number is specified then it returns the score of all the macros of that name
vote \<up, down, neutral> \<macro name> \<macro number> | Lets the user cast a vote on a macro to change its score.
