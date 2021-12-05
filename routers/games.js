const express = require('express');
const auth = require('../services/auth');

const GameManager = require('../services/games');

const router = express.Router();
const gameMgr = new GameManager();

/**
 * User routes
 */

router.put('/favourites', auth('user'), async (req, res) => {
    const result = await gameMgr.addToFavourites(res.locals.user, req.body.id);

    if (result) {
        res.status(200).send({message: 'Added to favourites'});
    } else {
        res.status(400).send({message: 'Game not found'});
    }
});

router.delete('/favourites/:id', auth('user'), async (req, res) => {
    if (await gameMgr.deleteFromFavourites(res.locals.user, req.params.id)) {
        res.sendStatus(204);
    } else {
        res.status(400).send({message: 'Could not remove from favourites'});
    }
});

/**
 * Admin routes
 */

router.post('/', auth('admin'), async (req, res) => {
    const game = await gameMgr.createGame(req.body);

    if (game) {
        res.status(201).send(game);
    } else {
        res.status(400).send({message: 'Game creation failed'});
    }
});

router.put('/:id', auth('admin'), async (req, res) => {
    const oldGame = await gameMgr.updateGame(req.params.id, req.body);

    if (oldGame) {
        res.status(200).send(oldGame);
    } else {
        res.status(404).send({message: 'Game not found'});
    }
});

router.delete('/:name', auth('admin'), async (req, res) => {
    console.log(req.params.name);
    
    if (await gameMgr.deleteGame(req.params.name)) {
        res.sendStatus(204);
    } else {
        res.status(400).send({message: 'No game name provided'});
    }
});

/**
 * Public routes
 */

router.get('/', async (req, res) => {
    const games = await gameMgr.getGamesOnPage(req.query.page);

    if (games) {
        res.status(200).send(games);
    } else {
        res.status(400).send({message: 'Invalid page number'});
    }
});

router.post('/search', async (req, res) => {
    const games = await gameMgr.searchGames(req.body);
    
    if (games) {
        res.status(200).send(games);
    } else {
        res.status(400).send({message: 'Invalid search query'});
    }
});

router.get('/categories', async (req, res) => {
    res.status(200).send(await gameMgr.getAllCategories());
});

router.get('/:id', async (req, res) => {
    const game = await gameMgr.getGameById(req.params.id);

    if (game) {
        res.status(200).send(game);
    } else {
        res.status(404).send({message: 'Game not found'});
    }
});

module.exports = router;
