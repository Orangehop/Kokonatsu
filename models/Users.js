var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: String,
    discriminator: String,
    discordId: String,
    avatar: String,
    accessToken: String,
    refreshToken: String,
    likes: [{type: Schema.Types.ObjectId, ref: 'Macro'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'Macro'}]
});

mongoose.model('user', UserSchema);