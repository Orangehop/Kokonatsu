var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: String,
    discriminator: String,
    discordId: String,
    avatar: String,
    accessToken: String,
    refreshToken: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'macro'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'macro'}],
    favorites: [{type: Schema.Types.ObjectId, ref: 'macro'}]
});

UserSchema.methods.like = function(_macroId){
    this.dislikes.pull(_macroId);
    this.likes.addToSet(_macroId);
    this.save();
};

UserSchema.methods.dislike = function(_macroId){
    this.likes.pull(_macroId);
    this.dislikes.addToSet(_macroId);
    this.save();
};

UserSchema.methods.neutral = function(_macroId){
    this.dislikes.pull(_macroId);
    this.likes.pull(_macroId);
    this.save();
};

UserSchema.methods.favorite = function(_macroId){
    this.favorites.addToSet(_macroId);
    this.save();
};

UserSchema.methods.unfavorite = function(_macroId){
    this.favorites.pull(_macroId);
    this.save();
};

mongoose.model('user', UserSchema);