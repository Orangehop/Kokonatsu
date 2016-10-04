var mongoose = require('mongoose');

var MacroSchema = new mongoose.Schema({
    name: String,
    guild: String,
    number: Number,
    link: String,
    upvotes: [String],
    downvotes: [String],
    usage: Number,
    favorites: Number
});

mongoose.model('TestMacro', MacroSchema);