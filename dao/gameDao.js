const Game = require('../models/game');
const connect = require('../services/db');

class MongoGameDao {
    async getGames(page) {
        const limit = 10;
        const start = page * limit;

        await connect();

        return await Game.find().sort().skip(start).limit(limit);
    }

    async getGameByName(name) {
        await connect();

        return await Game.find({name: name});
    }

    async getGameById(id) {
        await connect();

        return await Game.findById(id);
    }

    async getGamesById(ids) {
        await connect();

        return await Game.find({_id: {$in: ids}});
    }

    async getCategories() {
        await connect();

        return await Game.distinct('categories');
    }

    async searchGames(name, categories, page) {
        await connect();

        const filter = {};

        if (name) {
            // Inspired from https://stackoverflow.com/questions/43729199/how-i-can-use-like-operator-on-mongoose
            filter.name = {$regex: `.*${name}.*`, $options: 'i'};
        }

        if (categories && categories.length > 0) {
            filter.categories = {$in: categories};
        }

        return await Game.find(filter).sort().skip(10 * page).limit(10);
    }

    async addGame(game) {
        await connect();

        const newGame = new Game(game);
        await newGame.save();

        return newGame;
    }

    async updateGame(game, newData) {
        await connect();

        return await Game.findByIdAndUpdate(game.id, {$set: newData});
    }

    async deleteGame(gameName) {
        await connect();

        await Game.deleteOne({name: gameName});
    }
};

module.exports = new MongoGameDao();
