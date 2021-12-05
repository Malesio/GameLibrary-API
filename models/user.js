const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    gameId: { type: mongoose.Types.ObjectId, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, default: "" },
    email: { type: String, required: true },
    password: { type: String, required: true },
    img: { type: String, default: 'default.png' },
    admin: { type: Boolean, default: false },
    sessionTokens: [String],
    history: { type: [recordSchema], default: [] },
    favourites: { type: [mongoose.Types.ObjectId], default: [] }
});

const model = mongoose.model('User', userSchema);

module.exports = model;
