var mongoose = require('mongoose');

var MacroSchema = new mongoose.Schema({
    name: String,
    guild: String,
    number: Number,
    link: String,
    voters: [String],
    score: Number,
    usage: Number,
    favorites: Number
});

mongoose.model('TestMacro', MacroSchema);