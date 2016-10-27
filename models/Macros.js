var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MacroSchema = new mongoose.Schema({
    name: String,
    guild: String,
    number: Number,
    link: String,
    score: Number,
    usage: Number,
    likes: [{type: Schema.Types.ObjectId, ref: 'user'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'user'}]
});

MacroSchema.methods.like = function(_userId){
    this.dislikes.pull(_userId);
    if(this.likes.indexOf(_userId) == -1) this.likes.push(_userId);
    this.score = this.likes.length - this.dislikes.length;
    return this.save();
};

MacroSchema.methods.dislike = function(_userId){
    this.likes.pull(_userId);
    if(this.dislikes.indexOf(_userId) == -1) this.dislikes.push(_userId);
    this.score = this.likes.length - this.dislikes.length;
    return this.save();
};

MacroSchema.methods.neutral = function(_userId){
    this.likes.pull(_userId);
    this.dislikes.pull(_userId);
    this.score = this.likes.length - this.dislikes.length;
    return this.save();
};

MacroSchema.statics.delete = function(name, number, guildId){
    return this.find({guild: guildId, name: name}).populate('likes dislikes').exec().
    then(function(macros){
        var removePromise;
        macros.forEach(function(macro){
            if(macro.number == number){
                macro.likes.forEach(function(user){
                    user.neutral(macro._id);
                });
                macro.dislikes.forEach(function(user){
                    user.neutral(macro._id);
                });

                removePromise = macro.remove();
            }
            else if(macro.number > number){
                macro.number--;
                macro.save();
            }
        });

        return removePromise;
    });
}

mongoose.model('macro', MacroSchema);