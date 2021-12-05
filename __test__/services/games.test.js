const GameManager = require('../../services/games');
const mongoose = require('mongoose');

async function createJestGame() {
    const mgr = new GameManager();
    const randomId = Math.floor(Math.random() * 10000000000);

    const game = {name: `jest_game${randomId}`, src: "http://example.com"};
    const result = await mgr.createGame(game);

    return {mgr: mgr, jestGame: result};
}

async function deleteJestGame(game) {
    const mgr = new GameManager();
    await mgr.deleteGame(game.name);
}

afterAll(async () => {
    await mongoose.disconnect();
});

describe('GameManager create/delete game', () => {
    it('should create a new game', async () => {
        const { mgr, jestGame } = await createJestGame();

        expect(jestGame).not.toBe(false);

        await deleteJestGame(jestGame);
    });

    it('should not allow two games with the same name', async () => {
        const { mgr, jestGame } = await createJestGame();

        const result = await mgr.createGame({name: jestGame.name, src: "http://example.com"});
        expect(result).toBe(false);

        await deleteJestGame(jestGame);
    });
});

describe('GameManager get categories', () => {
    it('should return a list of categories without duplicates', async () => {
        const mgr = new GameManager();

        const categories = await mgr.getAllCategories();
        const isSet = (array) => new Set(array).size === array.length;

        expect(isSet(categories)).toBeTruthy();
    });
});
