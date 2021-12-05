const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    src: { type: String, required: true },
    img: { type: String, default: 'default.png'},
    categories: { type: [String], default: [] }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;