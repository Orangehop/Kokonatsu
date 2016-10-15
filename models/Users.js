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
    dislikes: [{type: Schema.Types.ObjectId, ref: 'macro'}]
});

mongoose.model('user', UserSchema);