const dao = require('../dao/gameDao');

class GameManager {
    prepareGameData(gameData) {
        delete gameData.id;
        delete gameData._id;

        if (gameData.categories) {
            if (typeof gameData.categories === 'string') {
                gameData.categories = [gameData.categories];
            }
        }
    }

    async createGame(gameData) {
        if (!gameData.name || !gameData.src) {
            return false;
        }

        if ((await dao.getGameByName(gameData.name)).length > 0) {
            return false;
        }

        this.prepareGameData(gameData);

        return await dao.addGame(gameData);
    }

    async updateGame(gameId, gameData) {
        const game = await dao.getGameById(gameId);
        if (!game) {
            return false;
        }

        if ((await dao.getGameByName(gameData.name)).length > 0) {
            return false;
        }

        this.prepareGameData(gameData);

        return await dao.updateGame(game, gameData);
    }

    async deleteGame(gameName) {
        if (!gameName) {
            return false;
        }

        await dao.deleteGame(gameName);

        return true;
    }

    async searchGames(searchData) {
        const { name, categories } = searchData;
        const page = parseInt(searchData.page) || 0;

        if (page >= 0) {
            return await dao.searchGames(name, categories, page);
        }

        return false;
    }

    async getGamesOnPage(page) {
        const pageInt = parseInt(page) || 0;
        if (pageInt < 0) {
            return false;
        }

        return await dao.getGames(pageInt);
    }

    async getGameById(id) {
        if (!id) {
            return false;
        }

        return await dao.getGameById(id);
    }

    async addToFavourites(user, gameId) {
        if (gameId) {
            const game = await dao.getGameById(gameId);
            if (game) {
                user.favourites.push(game.id);
                await user.save();

                return true;
            }
        }

        return false;
    }

    async deleteFromFavourites(user, gameId) {
        if (gameId) {
            const game = await dao.getGameById(gameId);
            if (game) {
                const favIdx = user.favourites.indexOf(game.id);
                if (favIdx !== -1) {
                    user.favourites.splice(favIdx, 1);
                    await user.save();

                    return true;
                }
            }
        }

        return false;
    }

    async getAllCategories() {
        return await dao.getCategories();
    }
};

module.exports = GameManager;
