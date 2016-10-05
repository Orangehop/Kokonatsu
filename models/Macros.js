var mongoose = require('mongoose');

var MacroSchema = new mongoose.Schema({
    name: String,
    guild: String,
    number: Number,
    link: String,
    score: Number,
    usage: Number,
});

mongoose.model('macro', MacroSchema);