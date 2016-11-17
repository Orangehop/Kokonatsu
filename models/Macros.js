var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MacroSchema = new mongoose.Schema({
    name: String,
    guild: String,
    number: Number,
    link: String,
    score: {type: Number, default: 0},
    usage: {type: Number, default: 0},
    dateCreated: { type: Date, default: Date.now },
});

MacroSchema.methods.inc = function(field, inc){
    var update = {$inc: {}};
    update.$inc[field] = inc;
    return this.model('macro').findByIdAndUpdate(this._id, update, {new: true}).exec();
}

MacroSchema.methods.like = function(user){
    return this.neutral(user).
    then(function(macro){
        return macro.inc("score", 1);
    });
}

MacroSchema.methods.dislike = function(user){
    return this.neutral(user).
    then(function(macro){
        return macro.inc("score", -1);
    });
}

MacroSchema.methods.neutral = function(user){
    var change = 0;
    var user
    if(user.likes.indexOf(this._id) != -1) change = -1;
    else if(user.dislikes.indexOf(this._id) != -1) change = 1;
    return this.inc("score", change);
}

MacroSchema.methods.delete = function(){
    this.model('user').update({}, {$pull: {likes: this._id, dislikes: this._id, favorites: this._id}}).exec();

    this.model('macro').find({guild: this.guild, name: this.name}).
    then(function(macros){
        macros.forEach(function(macro){
            if(macro.number > this.number) macro.inc("number", -1);
        });
    });

    return this.remove();
}

mongoose.model('macro', MacroSchema);