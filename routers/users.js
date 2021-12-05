const express = require('express');

const auth = require('../services/auth');
const AccountManager = require('../services/accounts');

const router = express.Router();
const accMgr = new AccountManager();

/**
 * Public routes
 */

router.post('/login', async (req, res) => {
    const sessionToken = await accMgr.login(req.body);

    if (sessionToken) {
        res.status(200).send({message: 'Login successful', token: sessionToken});
    } else {
        res.status(401).send({message: 'Invalid login credentials'});
    }
    
});

router.post('/register', async (req, res) => {
    const result = await accMgr.createAccount(req.body);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send({message: 'Could not create account'});
    }
});

/**
 * User routes
 */

router.get('/logout', auth('user'), async (req, res) => {
    if (await accMgr.logout(res.locals.user, res.locals.token)) {
        res.status(200).send({message: 'Logout successful'});
    } else {
        res.status(400).send({message: 'Invalid session token'});
    }
});

router.put('/password', auth('user'), async (req, res) => {
    const result = await accMgr.changePassword(res.locals.user, req.body);

    if (result) {
        res.status(200).send({message: 'Password changed successfully'});
    } else {
        res.status(401).send({message: 'Invalid password'});
    }
});

router.put('/me', auth('user'), async (req, res) => {
    const updated = await accMgr.changeUserData(res.locals.user, req.body);
    if (updated) {
        res.status(200).send(updated);
    } else {
        res.status(400).send({message: 'Could not update user data'});
    }
});

router.get('/me', auth('user'), async (req, res) => {
    res.status(200).send(await accMgr.getFullUserInfo(res.locals.user));
});

router.delete('/me', auth('user'), async (req, res) => {
    await accMgr.deleteAccount(res.locals.user.id);
    res.sendStatus(204);
});

/**
 * Admin routes
 */

router.get('/', auth('admin'), async (req, res) => {
    res.send(await accMgr.getAllUsers());
});

module.exports = router;
