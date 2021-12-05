const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const dao = require('../dao/userDao');
const gameDao = require('../dao/gameDao');

require('dotenv').config();

class AccountManager {
    async createAccount(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            return false;
        }

        if (await dao.getUserByEmail(userData.email)
            || await dao.getUser(userData.name)) {
            return false;
        }

        userData.password = await argon2.hash(userData.password);
        userData.admin = false;
        userData.bio ||= "";
        userData.img ||= "default.png";
        userData.history = [];

        delete userData.id;

        return await dao.addUser(userData);
    }

    async deleteAccount(userId) {
        await dao.deleteUser(userId);
    }

    async login(loginInfo) {
        const user = await dao.getUser(loginInfo.name);
        
        if (user && (await argon2.verify(user.password, loginInfo.password))) {
            const sessionInfo = {
                userId: user.id
            };

            const token = jwt.sign(sessionInfo, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXP
            });

            // user.sessionTokens.push(token);
            await dao.updateUser(user.id, user);

            return token;
        }

        return false;
    }

    async logout(user, sessionToken) {
        /*const idx = user.sessionTokens.indexOf(sessionToken);

        if (idx !== -1) {
            user.sessionTokens.splice(idx, 1);
            await dao.updateUser(user.id, user);

            return true;
        }

        return false;*/
        return true;
    }

    async changeUserData(user, newData) {
        let dirty = false;

        if (newData.email && (!await dao.getUserByEmail(newData.email))) {
            user.email = newData.email;
            dirty = true;
        }

        if (newData.name && (!await dao.getUser(newData.name))) {
            user.name = newData.name;
            dirty = true;
        }

        if (newData.bio) {
            user.bio = newData.bio;
            dirty = true;
        }

        if (newData.img) {
            user.img = newData.img;
            dirty = true;
        }

        if (dirty) {
            await user.save();
            return user;
        }

        return false;
    }

    async changePassword(user, body) {
        const { oldPassword, newPassword } = body;

        if (!oldPassword || !newPassword) {
            return false;
        }

        if (!await argon2.verify(user.password, oldPassword)) {
            return false;
        }

        user.password = await argon2.hash(newPassword);
        await user.save();

        return true;
    }

    async getFullUserInfo(user) {
        const userObj = user.toObject();
        const favourites = await gameDao.getGamesById(user.favourites);
    
        userObj.favourites = favourites;
        return userObj;
    }

    async getAllUsers() {
        return await dao.getUsers();
    }
}

module.exports = AccountManager;
