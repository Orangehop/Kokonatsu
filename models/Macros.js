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

mongoose.model('macro', MacroSchema);